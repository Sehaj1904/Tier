const avatarStyleOptions = [
  'adventurer', 'avataaars', 'big-ears', 'bottts', 'croodles',
  'fun-emoji', 'icons', 'identicon', 'initials', 'lorelei',
  'micah', 'miniavs', 'notionists', 'open-peeps', 'personas',
  'pixel-art', 'rings', 'shapes', 'thumbs'
]

const eventIconStyles = [
  'adventurer', 'avataaars', 'big-ears', 'croodles', 'fun-emoji',
  'lorelei', 'micah', 'notionists', 'open-peeps', 'personas'
]

const membershipIconThemes = {
  free: ['fun-emoji', 'croodles', 'shapes'],
  silver: ['adventurer', 'avataaars', 'open-peeps'],
  gold: ['lorelei', 'notionists', 'personas'],
  platinum: ['micah', 'big-ears', 'pixel-art']
}

function createStringHash(text: string): number {
  let hashValue = 0
  for (let characterIndex = 0; characterIndex < text.length; characterIndex++) {
    const currentCharacter = text.charCodeAt(characterIndex)
    hashValue = ((hashValue << 5) - hashValue) + currentCharacter
    hashValue = hashValue & hashValue
  }
  return Math.abs(hashValue)
}

function buildIconUrl(styleName: string, uniqueSeed: string, iconSize: number): string {
  const baseUrl = 'https://api.dicebear.com/8.x'
  const encodedSeed = encodeURIComponent(uniqueSeed)
  return `${baseUrl}/${styleName}/svg?seed=${encodedSeed}&size=${iconSize}&backgroundColor=random`
}

export function generateEventIcon(uniqueIdentifier: string, iconSize: number = 200): string {
  const selectedStyle = eventIconStyles[createStringHash(uniqueIdentifier) % eventIconStyles.length]
  return buildIconUrl(selectedStyle, uniqueIdentifier, iconSize)
}

export function generateUserAvatar(userIdentifier: string, avatarSize: number = 40): string {
  const selectedStyle = avatarStyleOptions[createStringHash(userIdentifier) % avatarStyleOptions.length]
  return buildIconUrl(selectedStyle, userIdentifier, avatarSize)
}

export function generateMembershipEventIcon(eventIdentifier: string, membershipLevel: string, iconSize: number = 200): string {
  const combinedSeed = `${eventIdentifier}-${membershipLevel}`
  const themeStyles = membershipIconThemes[membershipLevel as keyof typeof membershipIconThemes] || eventIconStyles
  const selectedStyle = themeStyles[createStringHash(combinedSeed) % themeStyles.length]
  
  return buildIconUrl(selectedStyle, combinedSeed, iconSize)
}