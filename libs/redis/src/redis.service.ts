import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private clients!: Readonly<Redis[]>;
  private clientsPublic!: Readonly<Redis[]>;

  async onModuleInit(): Promise<void> {
    this.logger.log('Connecting...');

    const redis1 = new Redis({
      host: 'redis-1',
      port: 6380,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
    const redis2 = new Redis({
      host: 'redis-2',
      port: 6381,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
    const redis3 = new Redis({
      host: 'redis-3',
      port: 6382,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    const redisList = [redis1, redis2, redis3] as const;
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
    this.clientsPublic = [...this.clients];

    this.logger.log('Connected');

    await this.verifyIsolation();
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting...');

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

    this.logger.log('Disconnected');
  }

  private async verifyIsolation(): Promise<void> {
    const randomIndex = Math.floor(Math.random() * this.clients.length);
    const client = this.clients.at(randomIndex);
    const verificationValue = `source-is-redis-${randomIndex + 1}`;

    if (!client) throw new Error('Expecting client');

    await client.set('verification_test', verificationValue);

    const values = await Promise.all(
      this.clients.map((client) => client.get('verification_test')),
    );
    const verifiedValues = values.filter(
      (value) => value === verificationValue,
    );

    if (verifiedValues.length > 1) {
      const logs = values.map((value, index) =>
        JSON.stringify([`Redis-${index + 1}`, value]),
      );
      const log = logs.join(', ');

      this.logger.error(log);

      this.logger.error(
        'Redis instances are sharing data! Check your hostnames.',
      );
      throw new Error(
        'Redis instances are sharing data! Check your hostnames.',
      );
    }

    await Promise.all(
      this.clients.map((client) => client.del('verification_test')),
    );
  }

  getClients(): Readonly<Redis[]> {
    return this.clientsPublic;
  }
}
