import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Demand } from '../models/Demand';
import { Profile } from '../models/Profile';


class DemandController {
    
    async create(request: Request, response: Response, next: NextFunction){
        
        const { name, description, status, concluded_at} = request.body;

        const schema = yup.object().shape({
            name: yup.string(). required(),
            description: yup.string().required(),
            status:yup.string().oneOf(['aguardando', 'executando', 'concluido', 'pendente', 'recusado']), 
            concluded_at: yup.date(),   
        });

        try{
            await schema.validate(request.body, { abortEarly: false});
        }catch(err){
            return response.status(400).json({status: "Erro na validação dos campos!"});
        }

        const resourceDemandRepository = APPDataSource.getRepository(Demand);

        const demandAlreadyExists = await resourceDemandRepository.findOne({where: {name: name}});
    
        if(demandAlreadyExists) {
            return response.status(400).json({status: "Demanda já existe"});
        }
        
        const demand = resourceDemandRepository.create({
            name,
            description,
            status,
            concluded_at,    
        });

        await resourceDemandRepository.save(demand);

        return response.status(201).json(demand);
    }

    async all(reques: Request, response: Response, next: NextFunction) {
        const resourceDemandRepository = APPDataSource.getRepository(Demand);

        const all = await resourceDemandRepository.find();

        return response.json(all);
    }

    async one(request: Request, response: Response, next: NextFunction){
        const resourceDemandRepository = APPDataSource.getRepository(Demand);

        const { id } = request.params;

        const one = await resourceDemandRepository.findOne({where: {id: id}});

        return response.json(one);
    }
    async update(request: Request, response: Response, next: NextFunction){
        const { name, description, status, concluded_at } = request.body;
        const id = request.params.id;
 
        const schema = yup.object().shape({
            name: yup.string().required(),
            description: yup.string(),
            status:yup.string().oneOf(['aguardando', 'executando', 'concluido', 'pendente', 'recusado']), 
            concluded_at: yup.date(),
            });

        try {
            await schema.validate(request.body, { abortEarly: false });
          } catch (err) {
            return response.status(400).json({status: "Erro de validação dos campos!"});
          }
                  
        
        const resourceDemandRepository = APPDataSource.getRepository(Demand);

       
        const demandFull = await resourceDemandRepository.findOne({
            where:{ id: id},
        });

        if(!demandFull) {
            return response.status(400).json({status: "demanda não encontrada"});
        }

        await resourceDemandRepository.save(demandFull);

        const demand = await resourceDemandRepository.update({ 
            id
        }, {
            name,
            description,
            status,
            concluded_at, 
        });

        return response.status(201).json(demand);
    }
    

    async remove(request: Request, response: Response, next: NextFunction) {
        const resourceDemandRepository = APPDataSource.getRepository(Demand);

        let demandToRemove = await resourceDemandRepository.findOneBy({id: request.params.id});

        if(!demandToRemove) {
            return response.status(400).json({status: "demanda não encontrada!"});
        }

        const deleteResponse = await resourceDemandRepository.softDelete(demandToRemove.id);
        if(!deleteResponse.affected) {
            return response.status(400).json({status: "demanda não excluida!"});
        }

        return response.json(demandToRemove);
    }

    async restore(request: Request, response: Response, next: NextFunction) {
        const resourceDemandRepository = APPDataSource.getRepository(Demand);

        let demandToRestore = await resourceDemandRepository.findOne({where: {id:request.params.id}, withDeleted:true});

        if(!demandToRestore){
            return response.status(400).json({status: "demanda não encontrada!"});
        }

        const restoreResponse = await resourceDemandRepository.restore(demandToRestore.id);

        if(restoreResponse.affected) {
            return response.status(200).json({status: "demanda recuperada"});
        }
        return response.json(resourceDemandRepository);
    }

    async paginar(request: Request, response: Response, next: NextFunction){
        const resourceDemandRepository = APPDataSource.getRepository(Demand);

        const { perPage, page, column} = request.query;
        const skip = parseInt(page.toString()) * parseInt(perPage.toString());

        const all = await resourceDemandRepository.createQueryBuilder('demand')
            .take( parseInt(perPage.toString()) )
            .skip( skip )
            .addOrderBy( column.toString(), 'ASC' )
            .getMany();

        return response.json(all);    
        }

    async token(request: Request, response: Response, next: NextFunction)  {
        const id = 1;
        const token = jwt.sign({id}, process.env.SECRET, {
            expiresIn: 43200,
        });

        return response.json({auth: true, token});
    }
}

export { DemandController }