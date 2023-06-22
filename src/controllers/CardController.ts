import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Card } from '../models/Card';


class CardController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { name, description, concluded_at, stage, tag, comment} = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      stage:  yup.string().required(),
      description: yup.string().required(),
      concluded_at: yup.date(),
      tag: yup.string().nullable(),
      comment: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceCardRepository = APPDataSource.getRepository(Card);

    const card = resourceCardRepository.create({
      name,
      stage,
      description,
      concluded_at,
      tag,
      comment,
    });

    await resourceCardRepository.save(card);

    return response.status(201).json(card);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceCardRepository = APPDataSource.getRepository(Card);

    const all = await resourceCardRepository.find({
      relations:{
          stage: true,  
      }
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceCardRepository = APPDataSource.getRepository(Card);
    
    const { id } = request.params;

    const one = await resourceCardRepository.findOne({ where: { id: id }, relations: {
      stage: true,
      
    } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, description, concluded_at, stage, tag, comment} = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
      description: yup.string().required(),
      concluded_at: yup.date(),
      stage: yup.string().required(),
      tag: yup.string().nullable(),
      comment: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceCardRepository = APPDataSource.getRepository(Card);


    const cardFull = await resourceCardRepository.findOne({
      where: {id:id},
      relations:{
       stage: true,  
      },
    });

    if(!cardFull){
      return response.status(400).json({status: "cartão não encontrado"})
    }

    await resourceCardRepository.save(cardFull);

    const card = await resourceCardRepository.update({
      id
    }, {
      name,
      stage,
      description,
      concluded_at,
      tag,
      comment,
    });

    return response.status(200).json(card);

  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceCardRepository = APPDataSource.getRepository(Card);

    let cardToRemove = await resourceCardRepository.findOneBy({ id: request.params.id });

    if (!cardToRemove) {
      return response.status(400).json({status: "cartão não encontrado!"});
    }
      

    const deleteResponse = await resourceCardRepository.softDelete(cardToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "cartão não excluido!"});
    }

    return response.json(cardToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceCardRepository = APPDataSource.getRepository(Card);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceCardRepository.createQueryBuilder( 'card' )
      .take( parseInt(perPage.toString()) )
      .skip( skip )
      .addOrderBy( column.toString(), 'ASC' )
      .getMany();

    return response.json(all);
  }
  

  async token(request: Request, response: Response, next: NextFunction) {
    const id = 1;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 43200,
    });

    return response.json({ auth: true, token });
  }

}

export { CardController };