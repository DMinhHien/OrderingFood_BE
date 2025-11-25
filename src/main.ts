import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Ordering Food API')
    .setDescription('API documentation for Ordering Food Backend')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('roles', 'Role management endpoints')
    .addTag('addresses', 'Address management endpoints')
    .addTag('restaurant-categories', 'Restaurant category endpoints')
    .addTag('product-categories', 'Product category endpoints')
    .addTag('menus', 'Menu management endpoints')
    .addTag('carts', 'Cart management endpoints')
    .addTag('cart-items', 'Cart item management endpoints')
    .addTag('restaurants', 'Restaurant management endpoints')
    .addTag('products', 'Product management endpoints')
    .addTag('orders', 'Order management endpoints')
    .addTag('order-details', 'Order detail management endpoints')
    .addTag('payments', 'Payment management endpoints')
    .addTag('discounts', 'Discount management endpoints')
    .addTag('feedbacks', 'Feedback management endpoints')
    .addTag('responses', 'Response management endpoints')
    .addTag('notifications', 'Notification management endpoints')
    .addTag('revenue-reports', 'Revenue report management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server started on port ${port}`);
  console.log(
    `Swagger documentation available at http://localhost:${port}/api`,
  );
}
void bootstrap();
