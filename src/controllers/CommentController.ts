import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Comment } from '../models/Comment';


class CommentController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { description, answers } = request.body;

    const schema = yup.object().shape({
      description: yup.string().required(),
      answers: yup.array().of(yup.object().shape({
        id: yup.string()
      })),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceCommentRepository = APPDataSource.getRepository(Comment);

    const commentAlreadyExists = await resourceCommentRepository.findOne({ where: { description: description } });

    if (commentAlreadyExists) {
      return response.status(400).json({status: "comentário já existe!"});
    }
    
    const comment = resourceCommentRepository.create({
      description,
      answers,
    });

    await resourceCommentRepository.save(comment);

    return response.status(201).json(comment);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceCommentRepository = APPDataSource.getRepository(Comment);

    const all = await resourceCommentRepository.find({
      relations:{
        answers: true,
      }
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceCommentRepository = APPDataSource.getRepository(Comment);
    
    const { id } = request.params;

    const one = await resourceCommentRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { description, answers} = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      description: yup.string().required(),
      answers: yup.array().of(yup.object().shape({
        id: yup.string()
      })),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceCommentRepository = APPDataSource.getRepository(Comment);

    const commentFull = await resourceCommentRepository.findOne({
      where:{id: id},
      relations:{
        answers: true,
      }
    });

    if(!commentFull){
      return response.status(400).json({status: "comentário não econtrado"});
    }

    commentFull.answers = answers;

    await resourceCommentRepository.save(commentFull);

    const comment = await resourceCommentRepository.update({
      id
    }, {
      description,
    });

    return response.status(201).json(comment);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceCommentRepository = APPDataSource.getRepository(Comment);

    let commentToRemove = await resourceCommentRepository.findOneBy({ id: request.params.id });

    if (!commentToRemove) {
      return response.status(400).json({status: "comentário não encontrado!"});
    }
      

    const deleteResponse = await resourceCommentRepository.softDelete(commentToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "comentário não excluido!"});
    }

    return response.json(commentToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const resourceCommentRepository = APPDataSource.getRepository(Comment);

    let commentToRestore = await resourceCommentRepository.findOne({ where: { id: request.params.id }, withDeleted: true });

    if (!commentToRestore) {
      return response.status(400).json({status: "comentário não encontrado!"});
    }
    
    const restoreResponse = await resourceCommentRepository.restore(commentToRestore.id);

    if (restoreResponse.affected) {
      return response.status(200).json({status: "comentário recuperado!"});
    }

    return response.json(resourceCommentRepository);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceCommentRepository = APPDataSource.getRepository(Comment);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceCommentRepository.createQueryBuilder( 'comment' )
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

export { CommentController };