import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Demand } from "./Demand";
import { Card } from "./Card";

@Entity("stage") 
export class Stage {

  @PrimaryColumn()
  readonly id: string; 
  
  @Column() 
  name: string;

  @ManyToOne(() => Demand,(demand) => demand.stages, {eager:true,
     nullable: false
  })
  demand: Demand;

  @OneToMany((type)=> Card,(card) => card.stage, {eager: true})
  cards: Card[]; 

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
