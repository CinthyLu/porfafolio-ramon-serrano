/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
//import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import nodemailer from "nodemailer";

// Transport Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "serranomanuel188@gmail.com",
    pass: "kdnu xkyc acag wwxw",
  },
});

export const notificarCambioCita = onDocumentUpdated(
  "appointments/{id}",
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!before || !after) return;

    // Solo enviar correo si cambia el estado
    if (before.status !== after.status) {
      const mensaje =
        after.status === "approved" ?
          "Tu solicitud ha sido APROBADA 🎉" :
          "Tu solicitud ha sido RECHAZADA ❌";

      await transporter.sendMail({
        from: "Sistema de Asesorías <TU_CORREO@gmail.com>",
        to: after.userEmail,
        subject: "Actualización de tu asesoría",
        text: mensaje,
      });

      console.log("Correo enviado a:", after.userEmail);
    }
  }
);
