import { Router } from 'express';
import { ProfileController } from './controllers/ProfileController';
import { verifyToken } from './Utils/functionsToken';
import { DemandController } from './controllers/DemandController';
import { StageController } from './controllers/StageController';
import { TagController } from './controllers/TagController';
import { AnswerController } from './controllers/AnswerController';
import { CommentController } from './controllers/CommentController';
import { CardController } from './controllers/CardController';
import { PhaseController } from './controllers/PhaseController';


const router = Router();
const profileController = new ProfileController();
const phaseController = new PhaseController();
const demandController = new DemandController();
const stageController = new StageController();
const tagController = new TagController();
const answerController = new AnswerController();
const commentController = new CommentController();
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
router.post("/profile",verifyToken, profileController.create);
router.get("/profile",verifyToken, profileController.all);
router.get("/profile/:id",verifyToken, profileController.one);
router.put("/profile/:id",verifyToken, profileController.update);
router.delete("/profile/:id",verifyToken, profileController.remove);
router.patch("/profile/:id",verifyToken, profileController.restore);

//PHASE
router.post("/phase", phaseController.create);
router.get("/phase", phaseController.all);
router.get("/phase/:id", phaseController.one);
router.put("/phase/:id", phaseController.update);
router.delete("/phase/:id", phaseController.remove);
router.patch("/phase/:id", phaseController.restore);


//DEMAND
router.post("/demand", demandController.create);
router.get("/demand", demandController.all);
router.get("/demand/:id", demandController.one);
router.put("/demand/:id",demandController.update);
router.delete("/demand/:id", demandController.remove);
router.patch("/demand/:id", demandController.restore);

//STAGE
router.post("/stage",verifyToken, stageController.create);
router.get("/stage",verifyToken, stageController.all);
router.get("/stage/:id",verifyToken, stageController.one);
router.put("/stage/:id",verifyToken, stageController.update);
router.delete("/stage/:id",verifyToken, stageController.remove);
router.patch("/stage/:id",verifyToken, stageController.restore);

//TAG
router.post("/tag",verifyToken, tagController.create);
router.get("/tag",verifyToken, tagController.all);
router.get("/tag/:id",verifyToken, tagController.one);
router.put("/tag/:id",verifyToken, tagController.update);
router.delete("/tag/:id",verifyToken, tagController.remove);
router.patch("/tag/:id",verifyToken, tagController.restore);

//ANSWER
router.post("/answer",verifyToken, answerController.create);
router.get("/answer",verifyToken, answerController.all);
router.get("/answer/:id",verifyToken, answerController.one);
router.put("/answer/:id",verifyToken, answerController.update);
router.delete("/answer/:id",verifyToken, answerController.remove);
router.patch("/answer/:id",verifyToken, answerController.restore);

//COMMENT
router.post("/comment",verifyToken, commentController.create);
router.get("/comment",verifyToken, commentController.all);
router.get("/comment/:id",verifyToken, commentController.one);
router.put("/comment/:id",verifyToken, commentController.update);
router.delete("/comment/:id",verifyToken, commentController.remove);
router.patch("/comment/:id",verifyToken, commentController.restore);


//CARD
router.post("/card",verifyToken, cardController.create);
router.get("/card",verifyToken, cardController.all);
router.get("/card/:id",verifyToken, cardController.one);
router.put("/card/:id",verifyToken, cardController.update);
router.delete("/card/:id",verifyToken, cardController.remove);
router.patch("/card/:id",verifyToken, cardController.restore);



router.get('/generateToken', profileController.token);

export { router }; // Retornando as rotas preenchidas para o server.ts