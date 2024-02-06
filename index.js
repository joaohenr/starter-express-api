const express = require('express');
const admin = require('firebase-admin');
const app = express();

// Inicialize o Firebase Admin SDK com suas credenciais
const serviceAccount = require('./google-services.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Rota POST para enviar notificações
app.post('/enviar-notificacao', async (req, res) => {
  try {
    const { token, messageBody } = req.body;

    // Envie a notificação usando os tokens e o corpo da mensagem fornecidos
    await admin.messaging().sendMulticast({
      token,
      data: {
        notifee: JSON.stringify({
          body: messageBody,
          android: {
            channelId: 'default',
            actions: [
              {
                title: 'Mark as Read',
                pressAction: {
                  id: 'read',
                },
              },
            ],
          },
        }),
      },
    });

    res.status(200).json({ message: 'Notificação enviada com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    res.status(500).json({ error: 'Erro ao enviar notificação.' });
  }
});

// Inicie o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

