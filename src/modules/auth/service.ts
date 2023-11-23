import Knex from 'knex';
import {config} from '../../db/config';
import { RefreshToken, User } from '../user/model';

const db = Knex(config.development);

export const getUser = async (query: any) => {
    return db('users').where(query).first();
}

export const createUser = async (data: User) => {
    return db('users').insert(data)
}

export const createRefreshToken = async (data: RefreshToken) => {
    return db('tokens').insert(data)
}

export const getRefreshToken = async (query: any) => {
    return db('tokens').where(query).first();
}

export const signOut = async (userId: number) => {
    return db('tokens').where({ userId }).del()
}