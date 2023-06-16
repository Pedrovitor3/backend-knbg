import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Stage } from '../models/Stage';



class StageController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    
    const { name, demand } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      demand: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceStageRepository = APPDataSource.getRepository(Stage);

   // const stageAlreadyExists = await resourceStageRepository.findOne({ where: { name: name } });

 //   if (stageAlreadyExists) {
 //     return response.status(400).json({status: "etapa já existe!"});
 //   }
    
    const stage = resourceStageRepository.create({
      name,
      demand,
    });

    await resourceStageRepository.save(stage);

    return response.status(201).json(stage);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceStageRepository = APPDataSource.getRepository(Stage);

    const all = await resourceStageRepository.find({
      relations:{
        demand: true,
      }
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceStageRepository = APPDataSource.getRepository(Stage);
    
    const { id } = request.params;

    const one = await resourceStageRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, demand} = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
      demand: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const resourceStageRepository = APPDataSource.getRepository(Stage);

   
    const stageFull = await resourceStageRepository.findOne({
      where: {id:id},
      relations:{
        
        demand:true,
      },
    })
  
    if(!stageFull){
      return response.status(400).json({status: "etapa não encontrada"})
    }

   
    await resourceStageRepository.save(stageFull);

    const stage = await resourceStageRepository.update({
      id
    }, {
      name,
      demand,
    });

    return response.status(201).json(stage);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceStageRepository = APPDataSource.getRepository(Stage);

    let stageToRemove = await resourceStageRepository.findOneBy({ id: request.params.id });

    if (!stageToRemove) {
      return response.status(400).json({status: "etapa não encontrada!"});
    }

    const deleteResponse = await resourceStageRepository.softDelete(stageToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "etapa não excluida!"});
    }

    return response.json(stageToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const resourceStageRepository = APPDataSource.getRepository(Stage);

    let stageToRestore = await resourceStageRepository.findOne({ where: { id: request.params.id }, withDeleted: true });

    if (!stageToRestore) {
      return response.status(400).json({status: "etapa não encontrado!"});
    }
    
    const restoreResponse = await resourceStageRepository.restore(stageToRestore.id);

    if (restoreResponse.affected) {
      return response.status(200).json({status: "etapa recuperado!"});
    }

    return response.json(resourceStageRepository);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const resourceStageRepository = APPDataSource.getRepository(Stage);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await resourceStageRepository.createQueryBuilder( 'stage' )
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

export { StageController };