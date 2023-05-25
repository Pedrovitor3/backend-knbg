import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { Phase } from '../models/Phase';
import jwt from 'jsonwebtoken';


class PhaseController {
  
  async create(request: Request, response: Response, next: NextFunction) {
    const { name, demands } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      demands: yup.array().of(yup.object().shape({
                id: yup.string()
            })),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const phaseRepository = APPDataSource.getRepository(Phase);

    const phaseAlreadyExists = await phaseRepository.findOne({ where: { name: name } });

    if (phaseAlreadyExists) {
      return response.status(400).json({status: "fase já existe!"});
    }

    const phase = phaseRepository.create({
      name,
      demands,
    });

    await phaseRepository.save(phase);

    return response.status(201).json(phase);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const phaseRepository = APPDataSource.getRepository(Phase);

    const all = await phaseRepository.find({
      relations: {
        demands: true,
    },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const phaseRepository = APPDataSource.getRepository(Phase);
    
    const { id } = request.params;

    const one = await phaseRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, demands } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
      demands: yup.array().of(yup.object().shape({
        id: yup.string()
    })),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({status: "Erro de validação dos campos!"});
    }

    const phaseRepository = APPDataSource.getRepository(Phase);

    const phaseFull = await phaseRepository.findOne({
      where:{ id: id},
      relations:{
        demands: true,
      },
    });

    if(!phaseFull) {
        return response.status(400).json({status: "perfil não encontrada"});
    }

    phaseFull.demands = demands;

    await phaseRepository.save(phaseFull);

    const phase = await phaseRepository.update({
      id
    }, {
      name,
    });

    return response.status(201).json(phase);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const phaseRepository = APPDataSource.getRepository(Phase);

    let phaseToRemove = await phaseRepository.findOneBy({ id: request.params.id });

    if (!phaseToRemove) {
      return response.status(400).json({status: "fase não encontrada!"});
    }
      
    const deleteResponse = await phaseRepository.softDelete(phaseToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({status: "fase não excluida!"});
    }

    return response.json(phaseToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const phaseRepository = APPDataSource.getRepository(Phase);

    let phaseToRestore = await phaseRepository.findOne({ where: { id: request.params.id }, withDeleted: true });

    if (!phaseToRestore) {
      return response.status(400).json({status: "fase não encontrado!"});
    }
    
    const restoreResponse = await phaseRepository.restore(phaseToRestore.id);

    if (restoreResponse.affected) {
      return response.status(200).json({status: "fase recuperada!"});
    }

    return response.json(phaseRepository);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const phaseRepository = APPDataSource.getRepository(Phase);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await phaseRepository.createQueryBuilder( 'phase' )
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

export { PhaseController };