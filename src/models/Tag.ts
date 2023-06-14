import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Card } from "./Card";

@Entity("tag") 
export class Tag {

  @PrimaryColumn()
  readonly id: string; 

  @Column() 
  name: string;

  @Column()
  cor:string;
  
  @ManyToMany(() => Card, (card) => card.tags, {nullable: false})
  cards: Card[];

  //sso
    // @Column()
    // id_setor
    

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
