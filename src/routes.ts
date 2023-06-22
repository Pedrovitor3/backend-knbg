import { Router } from 'express';
import { ProfileController } from './controllers/ProfileController';
import { verifyToken } from './Utils/functionsToken';
import { DemandController } from './controllers/DemandController';
import { StageController } from './controllers/StageController';
import { CardController } from './controllers/CardController';
import { TagController } from './controllers/TagController';


const router = Router();
const profileController = new ProfileController();
const demandController = new DemandController();
const stageController = new StageController();
const cardController = new CardController();
const tagController = new TagController();

/*
    5 métodos de requisição HTTP mais utilizados:
    GET => Busca
    POST => salvar
    PUT => Alterar
    DELETE => Deletar
    PATCH => Alteração específica
*/

//PROFILE
router.post("/profile", verifyToken, profileController.create);
router.get("/profile", verifyToken, profileController.all);
router.get("/profile/:id", verifyToken, profileController.one);
router.put("/profile/:id", verifyToken, profileController.update);
router.delete("/profile/:id", verifyToken, profileController.remove);
router.patch("/profile/:id", verifyToken, profileController.restore);


//DEMAND
router.post("/demand", verifyToken, demandController.create);
router.get("/demand", verifyToken, demandController.all);
router.get("/demand/:id", verifyToken, demandController.one);
router.put("/demand/:id", verifyToken,demandController.update);
router.delete("/demand/:id", verifyToken, demandController.remove);
router.patch("/demand/:id", verifyToken, demandController.restore);

//STAGE
router.post("/stage", verifyToken, stageController.create);
router.get("/stage", verifyToken, stageController.all);
router.get("/stage/:id", verifyToken, stageController.one);
router.put("/stage/:id", verifyToken, stageController.update);
router.delete("/stage/:id", verifyToken, stageController.remove);
router.patch("/stage/:id", verifyToken, stageController.restore);


//CARD
router.post("/card", verifyToken, cardController.create);
router.get("/card", verifyToken, cardController.all);
router.get("/card/:id", verifyToken, cardController.one);
router.put("/card/:id", verifyToken, cardController.update);
router.delete("/card/:id", verifyToken, cardController.remove);
router.patch("/card/:id", verifyToken, cardController.restore);

//TAG
router.post("/tag", verifyToken, tagController.create);
router.get("/tag", verifyToken, tagController.all);
router.get("/tag/:id", verifyToken, tagController.one);
router.put("/tag/:id", verifyToken, tagController.update);
router.delete("/tag/:id", verifyToken, tagController.remove);
router.patch("/tag/:id", verifyToken, tagController.restore);



router.get('/generateToken', profileController.token);

export { router }; // Retornando as rotas preenchidas para o server.ts