export interface CharacterRef {
  id: string;
  name: string;
  description: string;
  referencePrompt: string;
  createdAt: number;
}

export class CharacterStudioEngine {
  private chars = new Map<string, CharacterRef>();

  create(name: string, description: string): CharacterRef {
    const c: CharacterRef = {
      id: crypto.randomUUID(),
      name,
      description,
      referencePrompt: `Consistent character design sheet: ${name}. ${description}. Same character, clear features, reference sheet style`,
      createdAt: Date.now(),
    };
    this.chars.set(c.id, c);
    return c;
  }

  list() {
    return Array.from(this.chars.values());
  }

  posePrompt(c: CharacterRef, pose: string) {
    return `${c.referencePrompt}. Pose: ${pose}. Maintain exact same character appearance.`;
  }
}
