import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Tag } from '../models/Tag';



class TagController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { name, cor } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      cor: yup.string().required()
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceTagRepository = APPDataSource.getRepository(Tag);

    const tagAlreadyExists = await resourceTagRepository.findOne({ where: { name: name } });

    if (tagAlreadyExists) {
      return response.status(400).json({status: "etiqueta já existe!"});
    }
    
    const tag = resourceTagRepository.create({
      name,
      cor,

    });

    await resourceTagRepository.save(tag);

    return response.status(201).json(tag);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceTagRepository = APPDataSource.getRepository(Tag);

    const all = await resourceTagRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceTagRepository = APPDataSource.getRepository(Tag);
    
    const { id } = request.params;

    const one = await resourceTagRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, cor } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
      cor: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceTagRepository = APPDataSource.getRepository(Tag);

    

    const tag = await resourceTagRepository.update({
      id
    }, {
      name,
      cor,
    });

    return response.status(201).json(tag);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceTagRepository = APPDataSource.getRepository(Tag);

    let tagToRemove = await resourceTagRepository.findOneBy({ id: request.params.id });

    if (!tagToRemove) {
      return response.status(400).json({status: "etiqueta não encontrada!"});
    }
      

    const deleteResponse = await resourceTagRepository.softDelete(tagToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "etiqueta não excluida!"});
    }

    return response.json(tagToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const resourceTagRepository = APPDataSource.getRepository(Tag);

    let tagToRestore = await resourceTagRepository.findOne({ where: { id: request.params.id }, withDeleted: true });

    if (!tagToRestore) {
      return response.status(400).json({status: "etiqueta não encontrada!"});
    }
    
    const restoreResponse = await resourceTagRepository.restore(tagToRestore.id);

    if (restoreResponse.affected) {
      return response.status(200).json({status: "etiqueta recuperada!"});
    }

    return response.json(resourceTagRepository);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceTagRepository = APPDataSource.getRepository(Tag);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceTagRepository.createQueryBuilder( 'tag' )
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

export { TagController };