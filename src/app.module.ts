import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CampaignsModule } from './campaigns/campaigns.module.js';
import { CharactersModule } from './characters/characters.module.js';
import { ScenesModule } from './scenes/scenes.module.js';
import { UnitsModule } from './units/units.module.js';
import { HandoutsModule } from './handouts/handouts.module.js';
import { DrawingsModule } from './drawings/drawings.module.js';
import { WallsModule } from './walls/walls.module.js';
import { FogAreasModule } from './fog-areas/fog-areas.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    UsersModule,
    AuthModule,
    CampaignsModule,
    CharactersModule,
    ScenesModule,
    UnitsModule,
    HandoutsModule,
    DrawingsModule,
    WallsModule,
    FogAreasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
