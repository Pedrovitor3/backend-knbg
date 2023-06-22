import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Profile } from '../models/Profile';
import { Demand } from '../models/Demand';
import { Stage } from '../models/Stage';
import { Card } from '../models/Card';
import { UsersDemand } from '../models/UsersDemand';
import { Tag } from '../models/Tag';
require('dotenv').config();

//import { CreateUsuarios1656685284937 } from '../database/migrations/1656685284937-CreateUsuarios';

export const APPDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Profile, Demand, Stage, Tag,   Card, UsersDemand],
  //  migrations: [CreateUsuarios1656685284937],
  subscribers: [],
});