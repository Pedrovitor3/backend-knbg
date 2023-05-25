import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Tag } from "./Tag";
import { Stage } from "./Stage";
import { Comment } from "./Comment";

@Entity("card") 
export class Card {

  @PrimaryColumn()
  readonly id: string; 
  
  @Column()
  name: string;

  @Column({ type: 'text'})
  description: string;

  @Column({nullable: true})
  concluded_at:Date;

  @ManyToMany((type) => Tag, (tag) => tag.cards, {
    eager: true,
  })
  @JoinTable()
  tags: Tag[];

  @ManyToOne(() => Stage,(stage) => stage.cards)
  stage: Stage;

  @OneToMany(() => Comment, (comment) => comment.card, {
    eager: true
  })
  comments: Comment[];

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