-- CreateTable
CREATE TABLE "Scenario" (
    "id" SERIAL NOT NULL,
    "scenario_name" TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioQuestion" (
    "id" SERIAL NOT NULL,
    "scenario_question" TEXT NOT NULL,
    "question_id" INTEGER NOT NULL,
    "scenario_id" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScenarioQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioBroadcastTemplate" (
    "id" SERIAL NOT NULL,
    "broadcast_template_scenario" TEXT NOT NULL,
    "broadcast_template_id" INTEGER NOT NULL,
    "scenario_id" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScenarioBroadcastTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scenario_scenario_name_key" ON "Scenario"("scenario_name");

-- AddForeignKey
ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioQuestion" ADD CONSTRAINT "ScenarioQuestion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioQuestion" ADD CONSTRAINT "ScenarioQuestion_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioBroadcastTemplate" ADD CONSTRAINT "ScenarioBroadcastTemplate_broadcast_template_id_fkey" FOREIGN KEY ("broadcast_template_id") REFERENCES "BroadcastTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioBroadcastTemplate" ADD CONSTRAINT "ScenarioBroadcastTemplate_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
