export const issueDisplayNames: { [issue: string]: string } = {
  agriculture: 'Agriculture',
  civilrights: 'Civil Rights and Liberties',
  commerce: 'Banking and Commerce',
  defense: 'Defense',
  education: 'Education',
  energy: 'Energy',
  environment: 'Environment',
  governmentops: 'Goverment Operations',
  health: 'Health',
  immigration: 'Immigration',
  internationalaffairs: 'International Affairs',
  labor: 'Labor and Employment',
  lawcrime: 'Law, Crime, and Family',
  macro: 'Macroeconomics and Budget',
  nativeamericans: 'Native Americans',
  publiclands: 'Public Lands',
  technology: 'Science and Technology',
  trade: 'Foreign Trade',
  transportation: 'Transportation',
  welfare: 'Social Welfare',
  housing: 'Housing',
}

export const getIssueDisplayName = (issue: string): string => {
  return issueDisplayNames[issue] !== undefined
    ? issueDisplayNames[issue]
    : issue
}

export const getChamberDisplayName = (chamber: string): string => {
  return chamber === 'S' ? 'Senate' : 'House'
}