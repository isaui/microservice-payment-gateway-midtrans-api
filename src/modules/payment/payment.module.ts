import { Module } from '@nestjs/common'; // Pastikan nama file sesuai dengan lokasi file gateway Anda
import { PaymentController } from './controller/payment.controller';
import { SocketGateway } from './socket/socket.gateway';
import { SocketEventService } from './service/socket-event.service';

@Module({
  controllers: [PaymentController],
  providers: [SocketGateway, SocketEventService],
})
export class PaymentModule {}
