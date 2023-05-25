import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid'; 
import { Comment } from './Comment'

@Entity("answer") 
export class Answer {

  @PrimaryColumn()
  readonly id: string; 
  
  @Column({ type: 'varchar' }) 
  resposta: string;


  @ManyToOne(() => Comment, (comment) => comment.answers)
  comment: Comment;

    //sso
    // id_setor
    // id_user

  @DeleteDateColumn()
  deleted_at: Date;

  @CreateDateColumn() 
  created_at: Date;

  @UpdateDateColumn() 
  update_at: Date;



  /*
      A geração do uuID automático não será por meio do SGBD, e sim aqui pelo código
      Utilizando a bilioteca: yarn add uuid
      Tipos da biblioteca uuid: yarn add @tyapes/uuid -D
  */
  constructor() {
    // Se esse ID não existir, gerar um id
    if (!this.id) {
      this.id = uuid();
    }
  }
}
