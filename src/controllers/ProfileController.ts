import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { Profile } from '../models/Profile';
import jwt from 'jsonwebtoken';


class ProfileController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    const { name, demands } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      demands: yup.string(),
     
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const profileRepository = APPDataSource.getRepository(Profile);

    const profileAlreadyExists = await profileRepository.findOne({ where: { name: name } });

    if (profileAlreadyExists) {
      return response.status(400).json({status: "perfil já existe!"});
    }

    const profile = profileRepository.create({
      name,
      demands,
      
    });

    await profileRepository.save(profile);

    return response.status(201).json(profile);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const profileRepository = APPDataSource.getRepository(Profile);

    const all = await profileRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const profileRepository = APPDataSource.getRepository(Profile);
    
    const { id } = request.params;

    const one = await profileRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, demands } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
      demands: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const profileRepository = APPDataSource.getRepository(Profile);

    const profileFull = await profileRepository.findOne({
      where:{ id: id},
      
    });

    if(!profileFull) {
        return response.status(400).json({status: "perfil não encontrada"});
    }


    await profileRepository.save(profileFull);

    const profile = await profileRepository.update({
      id
    }, {
      name,
      demands,
    });

    return response.status(201).json(profile);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const profileRepository = APPDataSource.getRepository(Profile);

    let profileToRemove = await profileRepository.findOneBy({ id: request.params.id });

    if (!profileToRemove) {
      return response.status(400).json({status: "perfil não encontrado!"});
    }
      
    const deleteResponse = await profileRepository.softDelete(profileToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "perfil não excluido!"});
    }

    return response.json(profileToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const profileRepository = APPDataSource.getRepository(Profile);

    let profileToRestore = await profileRepository.findOne({ where: { id: request.params.id }, withDeleted: true });

    if (!profileToRestore) {
      return response.status(400).json({status: "perfil não encontrado!"});
    }
    
    const restoreResponse = await profileRepository.restore(profileToRestore.id);

    if (restoreResponse.affected) {
      return response.status(200).json({status: "perfil recuperado!"});
    }

    return response.json(profileRepository);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const profileRepository = APPDataSource.getRepository(Profile);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await profileRepository.createQueryBuilder( 'profile' )
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

export { ProfileController };