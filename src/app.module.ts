import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot(),AuthModule,MongooseModule.forRoot(process.env.MONGO_URI,
   {dbName:process.env.MONGO_DB_NAME} ),
  ],

})
export class AppModule {


}
// los controladores se encargan de escuchar las peticiones get,post,patch,delete

//guards proteccion de rutas
//pipes mutan la data.
//resource crea todo