let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  }

  return audioContext;
};

export const unlockNotificationSound = async () => {
  const ctx = getAudioContext();

  if (ctx.state === "suspended") {
    await ctx.resume();
  }
};

export const playNotificationSound = async () => {
  const ctx = getAudioContext();

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";

  // Nice little two-tone notification
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);
  oscillator.frequency.setValueAtTime(1174, ctx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.35);
};