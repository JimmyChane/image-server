import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
// @ts-ignore
import Redlock, { Lock } from 'redlock';

@Injectable()
export class RedlockService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedlockService.name);
  private clients!: Redis[];
  private redlock!: Redlock;

  async onModuleInit(): Promise<void> {
    this.logger.log('Redis Connecting...');

    const redisList = [
      new Redis({ host: 'redis-1', port: 6379, retryStrategy: (times) => Math.min(times * 50, 2000) }),
      new Redis({ host: 'redis-2', port: 6379, retryStrategy: (times) => Math.min(times * 50, 2000) }),
      new Redis({ host: 'redis-3', port: 6379, retryStrategy: (times) => Math.min(times * 50, 2000) }),
    ] as const;
    const clientPromises = redisList.map((redis) => {
      return new Promise<Redis>((r) => {
        const onConnect = () => {
          redis.off('connect', onConnect);
          r(redis);
        };

        redis.on('connect', onConnect);
      });
    });
    this.clients = await Promise.all(clientPromises);

    this.logger.log('Redis Connected');

    // 2. Configure Redlock
    this.redlock = new Redlock(this.clients, {
      driftFactor: 0.01, // time in ms
      retryCount: 10,
      retryDelay: 200, // time in ms
      retryJitter: 200, // time in ms
      automaticExtensionThreshold: 500, // time in ms
    });

    // Handle errors (important so your app doesn't crash)
    this.redlock.on('error', (error: Error) => {
      this.logger.error('Redlock error', error);
    });

    await this.verifyIsolation();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Redis Disconnecting...');

    const clientPromises = this.clients.map((client) => {
      return new Promise<Redis>(async (r) => {
        const onClose = () => {
          client.off('close', onClose);
          r(client);
        };
        client.on('close', onClose);

        await client.quit();
      });
    });
    await Promise.all(clientPromises);

    this.logger.log('Redis Disconnected');
  }

  private async verifyIsolation(): Promise<void> {
    const randomIndex = Math.floor(Math.random() * this.clients.length);
    const client = this.clients.at(randomIndex);
    const verificationValue = `source-is-redis-${randomIndex + 1}`;

    if (!client) throw new Error('Expecting client');

    await client.set('verification_test', verificationValue);

    const values = await Promise.all(this.clients.map((client) => client.get('verification_test')));
    const verifiedValues = values.filter((value) => value === verificationValue);

    if (verifiedValues.length > 1) {
      const logs = values.map((value, index) => JSON.stringify([`Redis-${index + 1}`, value]));
      const log = logs.join(', ');

      this.logger.error(log);

      this.logger.error('Redis instances are sharing data! Check your hostnames.');
      throw new Error('Redis instances are sharing data! Check your hostnames.');
    }

    await Promise.all(this.clients.map((client) => client.del('verification_test')));
  }

  async acquire(resource: string, ttl: number): Promise<Lock> {
    return await this.redlock.acquire([resource], ttl);
  }

  async using<T>(resource: string, ttl: number, handler: () => Promise<T>): Promise<T> {
    return await this.redlock.using([resource], ttl, async () => handler());
  }
}
