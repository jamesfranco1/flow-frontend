"use client";

import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  NATIVE_MINT,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  createApproveCheckedInstruction,
} from "@solana/spl-token";

const WSOL_DECIMALS = 9;

export function isNativeMint(mintStr) {
  return !mintStr || mintStr === "" || mintStr === "WSOL" || mintStr === NATIVE_MINT.toString();
}

export async function wrapAndApprove({
  userPublicKey,
  sendTransaction,
  connection,
  gatewayPubkey,
  amountLamports = LAMPORTS_PER_SOL,
}) {
  if (!gatewayPubkey) {
    throw new Error("Missing NEXT_PUBLIC_GATEWAY_PUBKEY");
  }

  const user = new PublicKey(userPublicKey);
  const gateway = new PublicKey(gatewayPubkey);
  const userAta = await getAssociatedTokenAddress(NATIVE_MINT, user);

  const tx = new Transaction();

  const ataInfo = await connection.getAccountInfo(userAta);
  if (!ataInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(user, userAta, user, NATIVE_MINT)
    );
  }

  tx.add(
    SystemProgram.transfer({
      fromPubkey: user,
      toPubkey: userAta,
      lamports: amountLamports,
    })
  );

  tx.add(createSyncNativeInstruction(userAta));

  tx.add(
    createApproveCheckedInstruction(
      userAta,
      NATIVE_MINT,
      gateway,
      user,
      amountLamports,
      WSOL_DECIMALS
    )
  );

  const sig = await sendTransaction(tx, connection, { skipPreflight: false });
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}

export async function approveToken({
  userPublicKey,
  sendTransaction,
  connection,
  gatewayPubkey,
  tokenMint,
  tokenDecimals,
  amount,
}) {
  if (!gatewayPubkey) throw new Error("Missing NEXT_PUBLIC_GATEWAY_PUBKEY");
  if (!tokenMint) throw new Error("Missing token mint");

  const user = new PublicKey(userPublicKey);
  const gateway = new PublicKey(gatewayPubkey);
  const mint = new PublicKey(tokenMint);
  const userAta = await getAssociatedTokenAddress(mint, user);

  const tx = new Transaction();

  const ataInfo = await connection.getAccountInfo(userAta);
  if (!ataInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(user, userAta, user, mint)
    );
  }

  tx.add(
    createApproveCheckedInstruction(
      userAta,
      mint,
      gateway,
      user,
      amount,
      tokenDecimals
    )
  );

  const sig = await sendTransaction(tx, connection, { skipPreflight: false });
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}

export async function getTokenBalance(connection, userPublicKey, tokenMint) {
  try {
    const mint = new PublicKey(tokenMint);
    const user = new PublicKey(userPublicKey);
    const ata = await getAssociatedTokenAddress(mint, user);
    const info = await connection.getTokenAccountBalance(ata);
    return Number(info.value.uiAmount || 0);
  } catch {
    return 0;
  }
}
