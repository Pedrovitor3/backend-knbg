import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Answer } from '../models/Answer';


class AnswerController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { resposta } = request.body;

    const schema = yup.object().shape({
      resposta: yup.string().required()
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceAnswerRepository = APPDataSource.getRepository(Answer);

    const answerAlreadyExists = await resourceAnswerRepository.findOne({ where: { resposta: resposta } });

    if (answerAlreadyExists) {
      return response.status(400).json({status: "resposta já existe!"});
    }
    
    const answer = resourceAnswerRepository.create({
      resposta,
    });

    await resourceAnswerRepository.save(answer);

    return response.status(201).json(answer);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceAnswerRepository = APPDataSource.getRepository(Answer);

    const all = await resourceAnswerRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceAnswerRepository = APPDataSource.getRepository(Answer);
    
    const { id } = request.params;

    const one = await resourceAnswerRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { resposta} = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      resposta: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceAnswerRepository = APPDataSource.getRepository(Answer);

    const answer = await resourceAnswerRepository.update({
      id
    }, {
      resposta,
    });

    return response.status(201).json(answer);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceAnswerRepository = APPDataSource.getRepository(Answer);

    let answerToRemove = await resourceAnswerRepository.findOneBy({ id: request.params.id });

    if (!answerToRemove) {
      return response.status(400).json({status: "resposta não encontrada!"});
    }
      

    const deleteResponse = await resourceAnswerRepository.softDelete(answerToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "resposta não excluida!"});
    }

    return response.json(answerToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const resourceAnswerRepository = APPDataSource.getRepository(Answer);

    let answerToRestore = await resourceAnswerRepository.findOne({ where: { id: request.params.id }, withDeleted: true });

    if (!answerToRestore) {
      return response.status(400).json({status: "resposta não encontrada!"});
    }
    
    const restoreResponse = await resourceAnswerRepository.restore(answerToRestore.id);

    if (restoreResponse.affected) {
      return response.status(200).json({status: "resposta recuperada!"});
    }

    return response.json(resourceAnswerRepository);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceAnswerRepository = APPDataSource.getRepository(Answer);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceAnswerRepository.createQueryBuilder( 'answer' )
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

export { AnswerController };