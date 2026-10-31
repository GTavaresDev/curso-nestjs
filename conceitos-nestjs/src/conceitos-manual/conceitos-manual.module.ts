import { Module } from "@nestjs/common";
import { ConceitosManualController } from "./conceitos-manuel.controller";

@Module({controllers: [ConceitosManualController]})
export class ConceitosManualModule{}