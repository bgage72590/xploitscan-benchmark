// Transactional email helper using the official Loops SDK. The key is passed
// inline to the constructor.
import { LoopsClient } from "loops";

const loops = new LoopsClient("00000000000000000000000000c0ffee");

export async function sendMagicLink(email: string, url: string) {
  await loops.sendTransactionalEmail({
    transactionalId: "clx1magiclink000000000000",
    email,
    dataVariables: { url },
  });
}
