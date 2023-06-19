import { Router } from 'express';
import { ProfileController } from './controllers/ProfileController';
import { } from './Utils/functionsToken';
import { DemandController } from './controllers/DemandController';
import { StageController } from './controllers/StageController';
import { CardController } from './controllers/CardController';


const router = Router();
const profileController = new ProfileController();
const demandController = new DemandController();
const stageController = new StageController();
const cardController = new CardController();

/*
    5 métodos de requisição HTTP mais utilizados:
    GET => Busca
    POST => salvar
    PUT => Alterar
    DELETE => Deletar
    PATCH => Alteração específica
*/

//PROFILE
router.post("/profile", profileController.create);
router.get("/profile", profileController.all);
router.get("/profile/:id", profileController.one);
router.put("/profile/:id", profileController.update);
router.delete("/profile/:id", profileController.remove);
router.patch("/profile/:id", profileController.restore);

//PHASE

//DEMAND
router.post("/demand", demandController.create);
router.get("/demand", demandController.all);
router.get("/demand/:id", demandController.one);
router.put("/demand/:id",demandController.update);
router.delete("/demand/:id", demandController.remove);
router.patch("/demand/:id", demandController.restore);

//STAGE
router.post("/stage", stageController.create);
router.get("/stage", stageController.all);
router.get("/stage/:id", stageController.one);
router.put("/stage/:id", stageController.update);
router.delete("/stage/:id", stageController.remove);
router.patch("/stage/:id", stageController.restore);


//CARD
router.post("/card", cardController.create);
router.get("/card", cardController.all);
router.get("/card/:id", cardController.one);
router.put("/card/:id", cardController.update);
router.delete("/card/:id", cardController.remove);
router.patch("/card/:id", cardController.restore);



router.get('/generateToken', profileController.token);

export { router }; // Retornando as rotas preenchidas para o server.ts