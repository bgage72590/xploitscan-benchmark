// Transactional email helper using the official Loops SDK, keyed from the
// environment. VC167 must NOT fire.
import { LoopsClient } from "loops";

const loops = new LoopsClient(process.env.LOOPS_API_KEY as string);

export async function sendMagicLink(email: string, url: string) {
  await loops.sendTransactionalEmail({
    transactionalId: "clx1magiclink000000000000",
    email,
    dataVariables: { url },
  });
}
