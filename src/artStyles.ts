export const artStyles=['liquid','baroque','matchbox','pixel','noir','aero','calendar','brutal','anti','curse','sigil','retro'] as const;
export type ArtStyle=typeof artStyles[number];
export const artSequence:Record<string,ArtStyle[]>={
 selected:['liquid'],trailers:['baroque','noir'],brands:['matchbox','calendar','brutal','aero','anti'],
 'short-form':['pixel','curse','sigil','retro'],youtube:['aero','retro','anti','baroque'],events:['noir','sigil']
};
export const posterCopy:Record<string,string[]>={
 selected:['I set the direction.','Then lead the work.','Shooting / editing / AI / VFX.','Research. Teams. Reach & retention.'],
 trailers:['Story. Tension.','Reveal.','Trailers + teasers.','Picture and sound. Working together.'],
 brands:['The identity.','The campaign.','Direction / editing / motion / 3D.','Built for the platform.'],
 'short-form':['Hook immediately.','Hold attention.','AI / compositing / lip-sync.','Distinctive images. Controlled pacing.'],
 youtube:['The opening hook.','The payoff.','Structure. Pacing. Visual identity.','Entertainment / interviews / food.'],
 events:['Keep the timing.','Carry the energy.','Comedy / festivals / live.','Performance. Anticipation. Impact.']
};
