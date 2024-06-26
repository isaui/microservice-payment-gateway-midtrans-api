import { Controller, Post, Body, Headers, BadRequestException } from '@nestjs/common';
import { SocketEventService } from '../service/socket-event.service';
import { PaymentEventEnum } from '../enums/payment-event.enum';
import { createHash } from 'crypto';
import { ConfigService } from '@nestjs/config';


@Controller('api/payment')
export class PaymentController {
  constructor(private readonly socketEventService: SocketEventService, private readonly configService: ConfigService) {}
  @Post('callback')
  handlePaymentCallback(@Body() body: any): string {
    const { order_id, status_code, gross_amount, signature_key } = body;
    const serverKey = this.configService.get<string>('MIDTRANS_SERVER_KEY');
    const stringToHash = `${order_id}${status_code}${gross_amount}${serverKey}`;

    const calculatedSignature = createHash('sha512').update(stringToHash).digest('hex');

    if (calculatedSignature !== signature_key) {
      console.log('unauthenticated')
      throw new BadRequestException('Invalid signature');
    }
    console.log('authenticated')

    if(body.transaction_status == 'settlement'){
        this.socketEventService.emitEvent(PaymentEventEnum.PAYMENT_STATUS, {orderId: body.order_id, status: 'settlement' })
    }
    return 'Callback received';
  }

}
