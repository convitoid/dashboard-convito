-- DropForeignKey
ALTER TABLE "BroadcastTemplate" DROP CONSTRAINT "BroadcastTemplate_client_id_fkey";

-- DropForeignKey
ALTER TABLE "ClientImage" DROP CONSTRAINT "ClientImage_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_clientId_fkey";

-- DropForeignKey
ALTER TABLE "GuestDetail" DROP CONSTRAINT "GuestDetail_guestId_fkey";

-- DropForeignKey
ALTER TABLE "Invitations" DROP CONSTRAINT "Invitations_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Invitations" DROP CONSTRAINT "Invitations_guestId_fkey";

-- DropForeignKey
ALTER TABLE "Invitations" DROP CONSTRAINT "Invitations_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QrBroadcastLogs" DROP CONSTRAINT "QrBroadcastLogs_QrGuestId_fkey";

-- DropForeignKey
ALTER TABLE "QrBroadcastTemplate" DROP CONSTRAINT "QrBroadcastTemplate_clientId_fkey";

-- DropForeignKey
ALTER TABLE "QrFile" DROP CONSTRAINT "QrFile_clientId_fkey";

-- DropForeignKey
ALTER TABLE "QrGalleryImage" DROP CONSTRAINT "QrGalleryImage_clientId_fkey";

-- DropForeignKey
ALTER TABLE "QrGuest" DROP CONSTRAINT "QrGuest_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Scenario" DROP CONSTRAINT "Scenario_client_id_fkey";

-- DropForeignKey
ALTER TABLE "ScenarioBroadcastTemplate" DROP CONSTRAINT "ScenarioBroadcastTemplate_broadcast_template_id_fkey";

-- DropForeignKey
ALTER TABLE "ScenarioBroadcastTemplate" DROP CONSTRAINT "ScenarioBroadcastTemplate_scenario_id_fkey";

-- DropForeignKey
ALTER TABLE "ScenarioQuestion" DROP CONSTRAINT "ScenarioQuestion_question_id_fkey";

-- DropForeignKey
ALTER TABLE "ScenarioQuestion" DROP CONSTRAINT "ScenarioQuestion_scenario_id_fkey";

-- DropForeignKey
ALTER TABLE "SendBlastingLogs" DROP CONSTRAINT "SendBlastingLogs_guestId_fkey";

-- AddForeignKey
ALTER TABLE "ClientImage" ADD CONSTRAINT "ClientImage_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestDetail" ADD CONSTRAINT "GuestDetail_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BroadcastTemplate" ADD CONSTRAINT "BroadcastTemplate_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioQuestion" ADD CONSTRAINT "ScenarioQuestion_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioQuestion" ADD CONSTRAINT "ScenarioQuestion_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioBroadcastTemplate" ADD CONSTRAINT "ScenarioBroadcastTemplate_broadcast_template_id_fkey" FOREIGN KEY ("broadcast_template_id") REFERENCES "BroadcastTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioBroadcastTemplate" ADD CONSTRAINT "ScenarioBroadcastTemplate_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitations" ADD CONSTRAINT "Invitations_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SendBlastingLogs" ADD CONSTRAINT "SendBlastingLogs_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrGalleryImage" ADD CONSTRAINT "QrGalleryImage_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrFile" ADD CONSTRAINT "QrFile_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrGuest" ADD CONSTRAINT "QrGuest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrBroadcastTemplate" ADD CONSTRAINT "QrBroadcastTemplate_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrBroadcastLogs" ADD CONSTRAINT "QrBroadcastLogs_QrGuestId_fkey" FOREIGN KEY ("QrGuestId") REFERENCES "QrGuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
