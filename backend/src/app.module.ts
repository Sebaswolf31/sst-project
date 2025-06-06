import { Module } from '@nestjs/common';
import typeormConfig from './config/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { InspectionsModule } from './inspections/inspections.module';





@Module({
  imports: [
    UsersModule,
    AuthModule,
    CompanyModule,
    InspectionsModule,

    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES },
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get('typeorm') || {};
        console.log('📡 Intentando conectar a la base de datos...');
        return dbConfig;
      },
    }),

    InspectionsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    console.log('✅ Módulo iniciado correctamente.');
    console.log(
      '🔗 Configuración actual de la BD:',
      this.configService.get('typeorm'),
    );
  }
}
