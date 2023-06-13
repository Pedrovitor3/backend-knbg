import { Router } from 'express';
import { ProfileController } from './controllers/ProfileController';
import { } from './Utils/functionsToken';
import { DemandController } from './controllers/DemandController';
import { StageController } from './controllers/StageController';
import { TagController } from './controllers/TagController';
import { AnswerController } from './controllers/AnswerController';
import { CommentController } from './controllers/CommentController';
import { CardController } from './controllers/CardController';


const router = Router();
const profileController = new ProfileController();
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

//TAG
router.post("/tag", tagController.create);
router.get("/tag", tagController.all);
router.get("/tag/:id", tagController.one);
router.put("/tag/:id", tagController.update);
router.delete("/tag/:id", tagController.remove);
router.patch("/tag/:id", tagController.restore);

//ANSWER
router.post("/answer", answerController.create);
router.get("/answer", answerController.all);
router.get("/answer/:id", answerController.one);
router.put("/answer/:id", answerController.update);
router.delete("/answer/:id", answerController.remove);
router.patch("/answer/:id", answerController.restore);

//COMMENT
router.post("/comment", commentController.create);
router.get("/comment", commentController.all);
router.get("/comment/:id", commentController.one);
router.put("/comment/:id", commentController.update);
router.delete("/comment/:id", commentController.remove);
router.patch("/comment/:id", commentController.restore);


//CARD
router.post("/card", cardController.create);
router.get("/card", cardController.all);
router.get("/card/:id", cardController.one);
router.put("/card/:id", cardController.update);
router.delete("/card/:id", cardController.remove);
router.patch("/card/:id", cardController.restore);



router.get('/generateToken', profileController.token);

export { router }; // Retornando as rotas preenchidas para o server.ts