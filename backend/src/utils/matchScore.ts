export interface MatchScoreResult {
  matchScore: number;
  rating: number;
  scoreBreakdown: {
    experienceScore: number;
    skillsScore: number;
    experienceMax: number;
    skillsMax: number;
  };
}

/**
 * Extracts the first numeric value from a string (e.g. "4.5 Years" -> 4.5, "6+" -> 6)
 */
export function parseExperience(str: string): number {
  if (!str) return 0;
  const matches = str.match(/\d+(\.\d+)?/g);
  if (!matches) return 0;
  return parseFloat(matches[0]);
}

/**
 * Parses min/max required experience bounds from a range string (e.g. "3-5 Years" -> { min: 3, max: 5 })
 */
export function parseRequiredExperienceRange(str: string): { min: number; max: number } {
  if (!str) return { min: 0, max: 0 };
  const matches = str.match(/\d+(\.\d+)?/g);
  if (!matches || matches.length === 0) return { min: 0, max: 0 };

  const min = parseFloat(matches[0]);
  const max = matches[1] ? parseFloat(matches[1]) : min;

  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
  };
}

/**
 * Compares candidate experience with the job required experience range (Max 60 points)
 */
export function calculateExperienceScore(candidateExpStr: string, requiredExpStr: string): number {
  const cand = parseExperience(candidateExpStr);
  const { min, max } = parseRequiredExperienceRange(requiredExpStr);

  if (cand === 0 && min === 0) return 60; // Fallback if no experience stated/required

  if (cand === max) {
    return 60;
  } else if (cand > min && cand < max) {
    return 55;
  } else if (cand === min) {
    return 50;
  } else if (cand < min) {
    const diff = min - cand;
    if (diff <= 1) return 25;
    return 10;
  } else {
    // cand > max
    return 58;
  }
}

/**
 * Matches candidate skills with required job skills case-insensitively (Max 40 points)
 */
export function calculateSkillsScore(candidateSkills: string | string[], requiredSkills: string[]): number {
  if (!requiredSkills || requiredSkills.length === 0) return 40;

  let candSkillsList: string[] = [];
  if (typeof candidateSkills === "string") {
    candSkillsList = candidateSkills
      .split(/[,;\n\t]+/)
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
  } else if (Array.isArray(candidateSkills)) {
    candSkillsList = candidateSkills
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
  }

  const reqSkillsList = requiredSkills
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  if (reqSkillsList.length === 0) return 40;

  let matches = 0;
  for (const reqSkill of reqSkillsList) {
    // Match exact or substring
    if (candSkillsList.some(candSkill => candSkill.includes(reqSkill) || reqSkill.includes(candSkill))) {
      matches++;
    }
  }

  const score = (matches / reqSkillsList.length) * 40;
  return Math.round(score);
}

/**
 * Calculates total match score, rating, and breakdown statistics
 */
export function computeMatchScore(
  candidateExp: string,
  candidateSkills: string | string[],
  jobExpRange: string,
  jobSkills: string[]
): MatchScoreResult {
  const expScore = calculateExperienceScore(candidateExp, jobExpRange);
  const skillsScore = calculateSkillsScore(candidateSkills, jobSkills);

  const total = expScore + skillsScore;
  const rating = Math.round((total / 10) * 10) / 10;

  return {
    matchScore: total,
    rating,
    scoreBreakdown: {
      experienceScore: expScore,
      skillsScore,
      experienceMax: 60,
      skillsMax: 40,
    },
  };
}
