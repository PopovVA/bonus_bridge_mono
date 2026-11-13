/**
 * Long-tail comparison and explainer pages. Copy stays inside Bucket 1 terms:
 * no fixed Rakuten dollar guarantee, no Lyft dollar amount, Chime capped at 10/year.
 */
import { FTC_AFFILIATE_DISCLOSURE } from '@/lib/site-disclaimers'
import { absoluteUrl } from '@/app/seo'

export type GuideLink = {
  href: string
  label: string
}

export type GuideSection = {
  id: string
  heading: string
  paragraphs: string[]
  bullets: string[]
  links: GuideLink[]
}

export type GuideTable = {
  caption: string
  columns: string[]
  rows: string[][]
}

export type GuideFaq = {
  question: string
  answer: string
}

export type Guide = {
  slug: string
  metaTitle: string
  h1: string
  description: string
  publishedAt: string
  updatedAt: string
  sections: GuideSection[]
  table: GuideTable
  faqs: GuideFaq[]
  related: GuideLink[]
  outbound: GuideLink[]
}

const UPDATED = '2026-11-05T18:00:00.000Z'
const SEO_GUIDES_DATE = '2026-11-09T18:00:00.000Z'

export const guideList: Guide[] = [
  {
    slug: 'rakuten-vs-topcashback',
    metaTitle: 'Rakuten vs TopCashback | BonusBridge',
    h1: 'Rakuten vs TopCashback',
    description:
      'Compare Rakuten and TopCashback signup bonuses, payout thresholds, exclusions, windows, and which cash-back portal fits a purchase.',
    publishedAt: UPDATED,
    updatedAt: UPDATED,
    sections: [
      {
        id: 'what-this-compares',
        heading: 'What this comparison covers',
        paragraphs: [
          'Rakuten and TopCashback are both shopping portals: you start at the portal, click through to a store, and the portal tracks an eligible purchase for cash back. A referral bonus is separate from the store’s own rate. It pays only when the new member meets that program’s rule.',
          'BonusBridge can link to both from pages we operate. Amounts change. Use each signup page as the live source before you rely on a number.'
        ],
        bullets: [
          'Portal cash back is pending before it becomes payable.',
          'A referral bonus is not the same as the store rate you see at checkout.',
          'Amazon and many gift-card or travel categories are often excluded or reduced.'
        ],
        links: [
          { href: '/stores/rakuten', label: 'Rakuten store guide' },
          { href: '/stores/topcashback', label: 'TopCashback store guide' }
        ]
      },
      {
        id: 'bonuses',
        heading: 'Signup and referral bonuses',
        paragraphs: [
          'Rakuten’s Refer-A-Friend terms allow a link on a site you own. The welcome bonus shown to a new member varies by the promo that is active when they join. It typically requires a qualifying Cash Back purchase within 90 days. Do not treat a single dollar figure as guaranteed across every visit.',
          'TopCashback’s current refer-a-friend terms pay the referrer $10 after the new member has $10 in eligible Cash Back within 365 days. The invitee’s own signup bonus depends on the promo running that day. Many retailers do not count toward the $10.'
        ],
        bullets: [
          'Rakuten window: qualifying Cash Back purchase, commonly within 90 days.',
          'TopCashback window: $10 eligible Cash Back within 365 days for the referrer $10.',
          'Neither bonus replaces reading the in-cart exclusions.'
        ],
        links: [
          { href: 'https://www.rakuten.com/help/article/referral-program-terms', label: 'Rakuten referral terms' },
          { href: 'https://www.topcashback.com/referrals/terms/', label: 'TopCashback referral terms' }
        ]
      },
      {
        id: 'payouts',
        heading: 'Payout methods and thresholds',
        paragraphs: [
          'Rakuten members in the US commonly choose PayPal, a check, or a gift card once payable cash back reaches Rakuten’s minimum. Big-purchase “Big Spend Bonus” style offers, when they exist, are separate from the referral welcome and have their own thresholds.',
          'TopCashback also pays by PayPal and other methods it lists in your account. Payable cash back is not the same as pending cash back. The $10 referral threshold uses eligible available cash back, not every tracked dollar.'
        ],
        bullets: [
          'Wait until a purchase moves from pending to payable before you count it.',
          'Returns, cancelled orders, and excluded categories can zero out a tracked bonus.',
          'Gift cards bought through a portal are a frequent exclusion.'
        ],
        links: [{ href: '/guides/how-cashback-signup-bonuses-work', label: 'How cashback signup bonuses work' }]
      },
      {
        id: 'which-to-use',
        heading: 'When to use each',
        paragraphs: [
          'Use Rakuten when you already shop its in-store card or browser extension and the live welcome terms match a purchase you will make inside the window. Use TopCashback when its rate for that store is higher or you want the longer 365-day window for the referrer threshold.',
          'Check both rates for the same merchant on the same day. Pick one click path. Two portals cannot both claim the same order.'
        ],
        bullets: [
          'One portal click per order.',
          'Start at the portal before the merchant site, or use only that portal’s extension.',
          'Confirm Amazon treatment on the portal. Rakuten generally excludes Amazon.com except limited Amazon properties such as music.'
        ],
        links: [
          { href: '/categories/shopping', label: 'Shopping category' },
          { href: '/disclosures', label: 'How BonusBridge vets programs' }
        ]
      }
    ],
    table: {
      caption: 'Rakuten and TopCashback side by side',
      columns: ['Topic', 'Rakuten', 'TopCashback'],
      rows: [
        ['Referrer bonus', 'Varies with the active promo. Confirm on the signup page.', '$10 after the invitee reaches $10 eligible Cash Back'],
        ['Invitee bonus', 'Welcome offer varies. Not a fixed public guarantee.', 'Depends on the promo active at signup'],
        ['Qualification window', 'Qualifying Cash Back purchase, typically within 90 days', '365 days to reach $10 eligible Cash Back'],
        ['Common exclusions', 'Amazon.com (with narrow exceptions) and non-qualifying categories', 'Many retailers excluded from eligible Cash Back'],
        ['Payout methods', 'PayPal, check, or gift card once payable and above the minimum', 'PayPal and other methods shown in the account'],
        ['Owned-site sharing', 'Allowed on pages you own and control', 'Allowed with privacy, cookie, and FTC notices']
      ]
    },
    faqs: [
      {
        question: 'Does Rakuten guarantee a $50 welcome bonus?',
        answer:
          'No. Public pages have shown different welcome amounts over time. BonusBridge describes the bonus as variable and tells you to confirm the live offer on Rakuten’s signup page.'
      },
      {
        question: 'When does the TopCashback referrer get $10?',
        answer:
          'After the new member earns $10 in eligible Cash Back within 365 days. Pending or excluded purchases do not count. The invitee bonus is whatever promo was advertised when they joined.'
      },
      {
        question: 'Can I use Rakuten and TopCashback on the same order?',
        answer:
          'No. One portal should track the order. Overlapping extensions or a second click-through often drops the cash back entirely.'
      },
      {
        question: 'Are Amazon orders eligible?',
        answer:
          'Rakuten’s referral terms exclude Amazon.com except narrow cases such as music.amazon.com. Always read the rate page for the store you are about to open.'
      }
    ],
    related: [
      { href: '/guides/how-cashback-signup-bonuses-work', label: 'How cashback signup bonuses work' },
      { href: '/guides/best-cashback-portals-2026', label: 'Best US cashback portals for 2026' },
      { href: '/categories/shopping', label: 'Shopping stores' }
    ],
    outbound: [
      { href: 'https://www.rakuten.com/r/MVADIM7', label: 'Open Rakuten' },
      { href: 'https://www.topcashback.com/ref/member344836925437', label: 'Open TopCashback' }
    ]
  },
  {
    slug: 'how-cashback-signup-bonuses-work',
    metaTitle: 'How Cashback Sign-Up Bonuses Work | BonusBridge',
    h1: 'How cashback sign-up bonuses actually work',
    description:
      'Pending versus payable cash back, excluded categories, portal clicks versus extensions, and why a referral bonus fails to track.',
    publishedAt: UPDATED,
    updatedAt: UPDATED,
    sections: [
      {
        id: 'two-kinds',
        heading: 'Two different bonuses',
        paragraphs: [
          'A portal pays you a percentage or flat amount for an eligible purchase. A signup or referral bonus is an extra amount for opening the account through a link and then meeting a spend or cash-back threshold. You can earn the store rate and still miss the signup bonus, or the reverse.',
          'Referral programs and affiliate programs are also different. A personal referral link is capped by that brand’s invite rules. An affiliate agreement is a publisher contract. BonusBridge only publishes referral links whose current US terms allow an owned website.'
        ],
        bullets: [
          'Store rate: what the portal lists for that merchant today.',
          'Signup bonus: extra credit for a new account if the qualifying action happens in time.',
          'Referral bonus: what the member who shared the link may earn after you qualify.'
        ],
        links: [{ href: '/disclosures', label: 'Programs we will and will not list' }]
      },
      {
        id: 'pending',
        heading: 'Pending versus payable',
        paragraphs: [
          'Pending means the portal saw a click and a merchant reported a sale. Payable, available, or confirmed means the return window passed and the merchant did not cancel the commission. Signup bonuses usually wait for payable cash back, not the pending figure.',
          'Banks and PayPal transfers of that payable balance are another step. A $10 “available” balance is not the same as money already in your bank.'
        ],
        bullets: [
          'Pending can sit for weeks on travel, phones, and made-to-order goods.',
          'A return moves the pending amount to zero.',
          'Referral counters use the program’s definition of eligible or available cash back.'
        ],
        links: [{ href: '/guides/rakuten-vs-topcashback', label: 'Rakuten vs TopCashback windows' }]
      },
      {
        id: 'tracking',
        heading: 'Why tracking fails',
        paragraphs: [
          'Portals track with a click ID or a browser extension cookie. Ad blockers, private windows, a second portal extension, and coupon tools that rewrite the URL all break that ID. Some merchants also drop tracking if the cart already had items before the click.',
          'Fix it before you pay: empty the cart, disable other shopping extensions, start from the portal, and place the order in the same browser without a VPN switch mid-checkout.'
        ],
        bullets: [
          'Turn off extra coupon extensions for that checkout.',
          'Do not open the merchant from email or Google after the portal click.',
          'Keep the confirmation email. Portals ask for it on missing-cash-back claims.',
          'Mobile apps often ignore a desktop portal click. Use the path the portal specifies.'
        ],
        links: [{ href: '/stores/honey', label: 'Honey points, not cash' }]
      },
      {
        id: 'extensions',
        heading: 'Browser extension versus portal click',
        paragraphs: [
          'A portal click is a single trip from the portal to the store. An extension activates that portal when you land on a supported store. Both can work. Both fail if two tools claim the same visit.',
          'Honey and similar extensions find coupon codes and may pay PayPal Rewards points. Those points are not the same as Rakuten or TopCashback cash back, and stacking them on one order is a common way to lose both.'
        ],
        bullets: [
          'Pick one tool before checkout.',
          'Read whether the signup bonus requires a portal click specifically.',
          'Points programs can take 60 to 90 days to confirm. Cash-back portals have their own pending clocks.'
        ],
        links: [
          { href: '/guides/best-cashback-portals-2026', label: '2026 portal comparison' },
          { href: '/categories/shopping', label: 'Shopping category' }
        ]
      }
    ],
    table: {
      caption: 'What each status means',
      columns: ['Status', 'What you see', 'What to do'],
      rows: [
        ['Clicked', 'Portal recorded the outbound click', 'Finish the order in that browser session'],
        ['Pending', 'Merchant reported a sale that can still be returned', 'Wait. Do not spend the figure yet'],
        ['Payable', 'Eligible cash back can be withdrawn', 'Request payout once you clear the minimum'],
        ['Excluded', 'Category or store does not pay', 'Do not expect a signup bonus from that order'],
        ['Missing', 'No order after a valid click', 'File the portal’s missing-cash-back form with the receipt']
      ]
    },
    faqs: [
      {
        question: 'Why did my referral bonus stay at zero after a purchase?',
        answer:
          'The order may still be pending, the store may be excluded, or another extension overwrote the click. Signup bonuses also ignore purchases outside the window, often 90 days at Rakuten and 365 days to reach TopCashback’s $10 eligible total.'
      },
      {
        question: 'Do coupon codes block cash back?',
        answer:
          'Codes from the same portal are usually fine. Codes or extensions from a different network often replace the tracking cookie. Apply a code only if that portal says the code is allowed.'
      },
      {
        question: 'Is a browser extension required?',
        answer:
          'No. A direct click from the portal is enough if you do not navigate away before paying. An extension is an alternative path, not a second payment on the same order.'
      },
      {
        question: 'How does BonusBridge get paid?',
        answer: FTC_AFFILIATE_DISCLOSURE
      }
    ],
    related: [
      { href: '/guides/rakuten-vs-topcashback', label: 'Rakuten vs TopCashback' },
      { href: '/stores/rakuten', label: 'Rakuten' },
      { href: '/stores/topcashback', label: 'TopCashback' }
    ],
    outbound: [
      { href: 'https://www.rakuten.com/r/MVADIM7', label: 'Rakuten signup' },
      { href: 'https://www.topcashback.com/ref/member344836925437', label: 'TopCashback signup' }
    ]
  },
  {
    slug: 'chime-referral-requirements',
    metaTitle: 'Chime Referral Requirements | BonusBridge',
    h1: 'Chime referral and direct deposit requirements',
    description:
      'Chime’s standard referral rules: a $200 qualifying direct deposit within 45 days, card activation, and a 10-referral calendar-year cap.',
    publishedAt: UPDATED,
    updatedAt: UPDATED,
    sections: [
      {
        id: 'standard-rules',
        heading: 'What the standard program requires',
        paragraphs: [
          'Chime’s help center describes a standard referral, not a blank check. The invited person needs a qualifying direct deposit of at least $200 within 45 days and must activate the Chime debit card. Chime has also described activating the physical card within 14 days of that deposit. Read the live help article before you treat any step as optional.',
          'The invited member’s bonus has been described as $100 after those steps. The referrer’s bonus is set when the invitee enrolls and is not one public number. BonusBridge does not promise a combined dollar total.'
        ],
        bullets: [
          'Minimum qualifying direct deposit: $200.',
          'Timing: within 45 days of account opening.',
          'Card activation is required.',
          'Referrer amount: variable, confirmed in the Chime offer at enrollment.'
        ],
        links: [
          {
            href: 'https://help.chime.com/what-is-chimes-standard-referral-program-eca42e30',
            label: 'Chime standard referral help'
          },
          { href: '/stores/chime', label: 'Chime on BonusBridge' }
        ]
      },
      {
        id: 'what-counts',
        heading: 'What counts as a direct deposit',
        paragraphs: [
          'Qualifying direct deposits are payroll, benefits, tax refunds, and other ACH deposits from an employer, government agency, or payroll provider into the Chime deposit account. Person-to-person transfers do not count. Sending money from Venmo, PayPal, Cash App, Zelle, or a friend’s bank app is not a payroll direct deposit.',
          'Moving money from your own account can also fail the test when it is not an employer or government ACH. If a deposit label looks like a transfer, do not assume Chime will count it.'
        ],
        bullets: [
          'Counts when it is a real payroll or government ACH of at least $200.',
          'Does not count: Venmo, PayPal, Cash App, Zelle, and similar peer-to-peer transfers.',
          'Split deposits still need to meet the minimum if Chime requires a single qualifying deposit. Confirm that wording in the app.'
        ],
        links: [{ href: '/articles/chime-1000-two-friends', label: 'Chime rules article' }]
      },
      {
        id: 'cap',
        heading: 'Annual cap',
        paragraphs: [
          'Chime limits successful referrals to 10 per calendar year. A page that multiplies a per-friend amount by dozens of people overstates the program. Two qualifying friends do not create a guaranteed four-figure payout.',
          'Older limited-time offers advertised higher referrer amounts. Those offers expire. This page follows the standard help-center rules and the 10-referral cap.'
        ],
        bullets: [
          'Cap: 10 successful referrals each calendar year.',
          'Unsuccessful invites, or invites that never get a qualifying deposit, do not increase that count.',
          'Tax reporting can apply to bonuses. Chime and your own records control that, not this site.'
        ],
        links: [
          { href: '/categories/finance', label: 'Finance category' },
          { href: '/disclosures', label: 'Why some finance referrals are unlisted' }
        ]
      },
      {
        id: 'not-a-bank',
        heading: 'Chime is not a bank',
        paragraphs: [
          'Chime is a financial technology company. Banking services are provided by partner banks. BonusBridge is not Chime and is not a bank. A referral link does not change fees, overdraft tools, or deposit insurance. Those terms live on Chime’s site.'
        ],
        bullets: [
          'Check the partner bank named in your Chime agreement.',
          'Early pay and spot-me style features are product terms, not part of the referral math.'
        ],
        links: [{ href: '/guides/how-cashback-signup-bonuses-work', label: 'Signup bonuses versus referral links' }]
      }
    ],
    table: {
      caption: 'Chime standard referral checklist',
      columns: ['Step', 'Rule', 'Does not count'],
      rows: [
        ['Open the account', 'Use the current invite link', 'An expired promo page'],
        ['Direct deposit', 'At least $200 within 45 days', 'Venmo, PayPal, Cash App, Zelle, or a friend transfer'],
        ['Card', 'Activate the debit card', 'Leaving the card inactive'],
        ['Referrer payout', 'Amount set when the invitee enrolls', 'A fixed public guarantee'],
        ['Volume', 'Up to 10 successful referrals per calendar year', 'Unlimited or “two friends to $1,000” claims']
      ]
    },
    faqs: [
      {
        question: 'Does Zelle or Venmo count as a Chime direct deposit?',
        answer:
          'No. Peer-to-peer transfers are not qualifying direct deposits. Use payroll, benefits, or another ACH that Chime’s current terms list as qualifying, and meet the $200 minimum inside 45 days.'
      },
      {
        question: 'Can I earn a referral bonus for more than 10 friends this year?',
        answer:
          'The standard program caps successful referrals at 10 per calendar year. Extra shares do not raise that cap.'
      },
      {
        question: 'Is the referrer bonus always $300?',
        answer:
          'No. Older promotions used different amounts. The standard program sets the referrer bonus when the invited member enrolls. Confirm the figure in Chime before you share a number.'
      },
      {
        question: 'How fast does the bonus post?',
        answer:
          'After Chime confirms the qualifying deposit and card activation. It is not instant at signup. Timing is defined in the live offer, not by a calculator on this site.'
      }
    ],
    related: [
      { href: '/articles/chime-1000-two-friends', label: 'Chime referral rules article' },
      { href: '/stores/chime', label: 'Chime store page' },
      { href: '/categories/finance', label: 'Finance stores' }
    ],
    outbound: [{ href: 'https://www.chime.com/r/vadimpopov1/', label: 'Continue to Chime' }]
  },
  {
    slug: 'best-cashback-portals-2026',
    metaTitle: 'Best US Cashback Portals 2026 | BonusBridge',
    h1: 'Best cashback and shopping portals in the US for 2026',
    description:
      'An honest 2026 look at Rakuten, TopCashback, and PayPal Honey, plus practical stacking rules that keep cash back from falling off.',
    publishedAt: UPDATED,
    updatedAt: UPDATED,
    sections: [
      {
        id: 'how-we-chose',
        heading: 'How this list was chosen',
        paragraphs: [
          'This page only includes shopping portals whose US referral terms allow BonusBridge to post a link on a site we operate, with accurate limits. Personal-only brokerage, payments, and insurance invites are not here. They are explained on the disclosures page.',
          '“Best” means the clearest fit for a US online purchase in 2026, not the highest advertised bonus. A portal with a lower rate and clean tracking beats a headline number that excludes the store you actually use.'
        ],
        bullets: [
          'Rakuten and TopCashback are cash-back portals.',
          'PayPal Honey is a coupon and points tool. Points are not cash.',
          'Chime and Lyft solve different jobs and are not shopping portals.'
        ],
        links: [
          { href: '/disclosures', label: 'Vetting notes' },
          { href: '/categories/shopping', label: 'Shopping category' }
        ]
      },
      {
        id: 'portals',
        heading: 'The portals',
        paragraphs: [
          'Rakuten fits shoppers who want in-store and online rates and a welcome bonus that changes with the promo. Plan on a qualifying Cash Back purchase within about 90 days, and do not assume Amazon pays.',
          'TopCashback fits shoppers who want a long window. The referrer side of the current promo is $10 after $10 of eligible Cash Back inside 365 days. Compare the merchant rate against Rakuten the same day.',
          'PayPal Honey fits shoppers who want coupon tests and PayPal Rewards points. A referral may pay 500 points after a friend’s purchase confirms, often 60 to 90 days later. Do not describe that as instant cash, and do not stack Honey on top of another portal for the same order.'
        ],
        bullets: [
          'Compare the rate for the exact store, not a homepage average.',
          'One tracking path per order.',
          'Read payout minimums inside the account before you expect a transfer.'
        ],
        links: [
          { href: '/stores/rakuten', label: 'Rakuten' },
          { href: '/stores/topcashback', label: 'TopCashback' },
          { href: '/stores/honey', label: 'PayPal Honey' }
        ]
      },
      {
        id: 'stacking',
        heading: 'Stacking without losing the trail',
        paragraphs: [
          'Stacking means combining a store coupon, a card reward, and one portal. It does not mean running three portal extensions. Card rewards post at the bank even when a portal misses, so they are the safest layer. The portal is the fragile layer.',
          'A store coupon from the same portal is usually compatible. A coupon copied from a different affiliate site often is not. If the rate disappears at checkout, stop and re-click from the portal rather than paying untracked.'
        ],
        bullets: [
          'Card rewards can sit under one portal click.',
          'Do not enable Honey and Rakuten and TopCashback together.',
          'In-store Rakuten card offers, where you use one, follow Rakuten’s in-store instructions.',
          'Screenshot the rate before you pay.'
        ],
        links: [{ href: '/guides/how-cashback-signup-bonuses-work', label: 'Why tracking fails' }]
      },
      {
        id: 'not-portals',
        heading: 'What we left off on purpose',
        paragraphs: [
          'Lyft may offer a market-specific new-rider credit after a first ride within 30 days. That is a rideshare credit, not a shopping portal, and Lyft does not allow us to print one nationwide dollar amount.',
          'Chime is a banking app referral with a direct-deposit test and a 10-referral yearly cap. Brokerage and insurance invites that require a personal relationship stay off this list.'
        ],
        bullets: [
          'Use the Lyft page for ride credit, not for cash back on retail.',
          'Use the Chime guide for deposit rules.',
          'Skipped brands are documented under disclosures.'
        ],
        links: [
          { href: '/stores/lyft', label: 'Lyft market-specific credit' },
          { href: '/guides/chime-referral-requirements', label: 'Chime requirements' }
        ]
      }
    ],
    table: {
      caption: 'US shopping portals we will link in 2026',
      columns: ['Portal', 'You receive', 'Watch-out'],
      rows: [
        ['Rakuten', 'Cash back plus a variable welcome bonus', 'Amazon exclusions and a roughly 90-day qualifying purchase'],
        ['TopCashback', 'Cash back; referrer $10 after a $10 eligible threshold', 'Many retailers excluded from the 365-day threshold'],
        ['PayPal Honey', 'Coupons and PayPal Rewards points', '500 points is not cash and can take 60 to 90 days']
      ]
    },
    faqs: [
      {
        question: 'Which portal pays the most in 2026?',
        answer:
          'Whichever shows the higher eligible rate for the store you are opening today. A larger signup headline loses to a higher rate on a purchase you will actually make.'
      },
      {
        question: 'Should I install every extension?',
        answer:
          'No. Keep a single portal or coupon tool active at checkout. Extra extensions are the usual reason cash back never appears.'
      },
      {
        question: 'Where are Uber, Robinhood, and credit-card invites?',
        answer:
          'They are not on this portal list. Several of those programs limit sharing to people you know, or we could not verify public-website terms. See the disclosures page.'
      },
      {
        question: 'Do you earn a commission if I sign up?',
        answer: FTC_AFFILIATE_DISCLOSURE
      }
    ],
    related: [
      { href: '/guides/rakuten-vs-topcashback', label: 'Rakuten vs TopCashback' },
      { href: '/categories/shopping', label: 'Shopping stores' },
      { href: '/categories/electronics', label: 'Electronics stores' }
    ],
    outbound: [
      { href: 'https://www.rakuten.com/r/MVADIM7', label: 'Rakuten' },
      { href: 'https://www.topcashback.com/ref/member344836925437', label: 'TopCashback' },
      { href: 'https://www.joinhoney.com/ref/nwpz6sw', label: 'PayPal Honey' }
    ]
  },
  {
    slug: 'topcashback-referral-program',
    metaTitle: 'TopCashback Referral Program Explained | BonusBridge',
    h1: 'TopCashback referral program: who gets the $10',
    description:
      'Who gets the $10, what counts toward the $10 Cash Back threshold, the 365-day window, and what TopCashback’s terms do not promise new members.',
    publishedAt: SEO_GUIDES_DATE,
    updatedAt: SEO_GUIDES_DATE,
    sections: [
      {
        id: 'who-gets-what',
        heading: 'Who gets what',
        paragraphs: [
          'TopCashback’s US referral terms pay the member who shares the link $10 Cash Back for each qualifying referral. The same terms do not state a fixed referral bonus for the new member. Any welcome offer you see when you join is set by TopCashback at that time.',
          'If you join through the BonusBridge link and qualify, BonusBridge may receive that $10. You pay nothing extra.'
        ],
        bullets: [
          'Referrer: $10 Cash Back per qualifying referral.',
          'New member: no fixed amount in the referral terms.',
          'TopCashback says the amount and the qualifying period are subject to change.'
        ],
        links: [{ href: 'https://www.topcashback.com/referrals/terms/', label: 'TopCashback referral terms' }]
      },
      {
        id: 'qualifying',
        heading: 'What makes a referral qualify',
        paragraphs: [
          'The new member clicks the referral link, signs up, verifies the account, and then earns at least $10 in eligible Cash Back within 365 days of joining.',
          'Eligible is the key word. Purchases at excluded retailers do not count, and goodwill or bonus Cash Back does not count toward the $10.'
        ],
        bullets: [
          'Sign up through the link itself, not a later visit to the home page.',
          'Verify the account. An unverified account cannot qualify.',
          'Only eligible Cash Back counts toward the $10.',
          'The clock is 365 days from joining.'
        ],
        links: [{ href: '/guides/how-cashback-signup-bonuses-work', label: 'Pending versus payable Cash Back' }]
      },
      {
        id: 'tracking',
        heading: 'Make your purchases count',
        paragraphs: [
          'Cash Back only counts if the purchase tracks. Start each order from TopCashback, finish it in the same browser, and switch off other coupon or cash-back extensions for that checkout.',
          'Pending Cash Back is not yet eligible. A return removes it, so the $10 can take longer than the first order.'
        ],
        bullets: [
          'One portal or extension per order.',
          'Keep the order confirmation email for missing Cash Back claims.',
          'Check the store page on TopCashback for exclusions before you buy.'
        ],
        links: [{ href: '/guides/rakuten-vs-topcashback', label: 'Rakuten vs TopCashback' }]
      }
    ],
    table: {
      caption: 'TopCashback referral at a glance',
      columns: ['Item', 'What the terms say'],
      rows: [
        ['Referrer reward', '$10 Cash Back per qualifying referral'],
        ['New member reward', 'Not stated in the referral terms'],
        ['Threshold', '$10 of eligible Cash Back'],
        ['Window', '365 days from joining'],
        ['Does not count', 'Excluded retailers, goodwill or bonus Cash Back'],
        ['Can it change?', 'Yes, amount and period are subject to change']
      ]
    },
    faqs: [
      {
        question: 'Do I get $10 for joining TopCashback through a referral link?',
        answer:
          'The referral terms pay the $10 to the member who shared the link. They do not state a fixed amount for the new member. Check TopCashback’s sign-up page for any welcome offer running when you join.'
      },
      {
        question: 'How long do I have to reach $10 in Cash Back?',
        answer: '365 days from the day you join, counting only eligible Cash Back.'
      },
      {
        question: 'Does bonus Cash Back count toward the $10?',
        answer: 'No. TopCashback’s terms exclude goodwill and bonus Cash Back, and purchases at excluded retailers.'
      },
      {
        question: 'How does BonusBridge get paid?',
        answer: FTC_AFFILIATE_DISCLOSURE
      }
    ],
    related: [
      { href: '/stores/topcashback', label: 'TopCashback' },
      { href: '/guides/rakuten-vs-topcashback', label: 'Rakuten vs TopCashback' },
      { href: '/guides/how-cashback-signup-bonuses-work', label: 'How cashback sign-up bonuses work' }
    ],
    outbound: [{ href: 'https://www.topcashback.com/ref/member344836925437', label: 'Join TopCashback' }]
  },
  {
    slug: 'paypal-honey-referral-points',
    metaTitle: 'PayPal Honey Referral Points Explained | BonusBridge',
    h1: 'PayPal Honey referrals: points, not cash',
    description:
      'What the 500-point referral bonus is, who receives it, why it takes 60 to 90 days, and how Honey points differ from cash-back portals.',
    publishedAt: SEO_GUIDES_DATE,
    updatedAt: SEO_GUIDES_DATE,
    sections: [
      {
        id: 'who-gets-what',
        heading: 'Who gets what',
        paragraphs: [
          'PayPal Honey’s help page describes a 500-point referral bonus for the member who invites a friend. The friend signs up with the invite link and earns PayPal Rewards points on purchases. The page does not state a fixed referral amount for the new member.',
          'The reward is PayPal Rewards points, not cash. If you join through the BonusBridge link, BonusBridge may receive the referral points.'
        ],
        bullets: [
          'Referrer: 500 PayPal Rewards points.',
          'New member: earns points on purchases; no fixed referral amount stated.',
          'A limit on referral bonuses applies under Honey’s Terms of Use.'
        ],
        links: [{ href: 'https://help.joinhoney.com/article/33-can-i-refer-people-to-honey', label: 'PayPal Honey referral help' }]
      },
      {
        id: 'timing',
        heading: 'Why it takes 60 to 90 days',
        paragraphs: [
          'The referral bonus is paid after the friend’s points are confirmed. Points stay pending while the store’s return window runs, which Honey says is often 60 to 90 days.',
          'A returned or cancelled order can remove the pending points, and with them the referral bonus.'
        ],
        bullets: [
          'Pending points are not spendable yet.',
          'Confirmed points can be redeemed under PayPal Rewards rules.',
          'Keep the order confirmation until the points confirm.'
        ],
        links: [{ href: '/guides/how-cashback-signup-bonuses-work', label: 'Pending versus payable explained' }]
      },
      {
        id: 'vs-portals',
        heading: 'Honey points versus cash-back portals',
        paragraphs: [
          'Honey is a browser extension that finds coupon codes and can award PayPal Rewards points. Rakuten and TopCashback are cash-back portals that pay a share of the order.',
          'Running two of these on one checkout often breaks tracking for both. Pick one tool per order.'
        ],
        bullets: [
          'Points are not cash and follow PayPal Rewards redemption rules.',
          'Disable other extensions when you start an order from a portal.',
          'Compare portals before you choose which one to use for a big order.'
        ],
        links: [{ href: '/guides/best-cashback-portals-2026', label: 'US cashback portals compared' }]
      }
    ],
    table: {
      caption: 'PayPal Honey referral at a glance',
      columns: ['Item', 'What Honey’s help page says'],
      rows: [
        ['Referrer reward', '500 PayPal Rewards points'],
        ['New member reward', 'Points on purchases; no fixed referral amount stated'],
        ['When it pays', 'After the friend’s points confirm, often 60 to 90 days'],
        ['Limit', 'A cap on referral bonuses under the Terms of Use'],
        ['Cash or points?', 'Points, not cash']
      ]
    },
    faqs: [
      {
        question: 'Is the Honey referral bonus cash?',
        answer: 'No. It is paid in PayPal Rewards points.'
      },
      {
        question: 'How many points does a Honey referral give?',
        answer:
          'Honey’s help page lists a 500-point referral bonus for the member who invited the friend. It does not state a fixed referral amount for the new member.'
      },
      {
        question: 'Why are my referral points still pending?',
        answer:
          'The bonus waits for the friend’s purchase points to confirm. That pending period is often 60 to 90 days, depending on the store.'
      },
      {
        question: 'How does BonusBridge get paid?',
        answer: FTC_AFFILIATE_DISCLOSURE
      }
    ],
    related: [
      { href: '/stores/honey', label: 'PayPal Honey' },
      { href: '/guides/best-cashback-portals-2026', label: 'US cashback portals compared' },
      { href: '/guides/how-cashback-signup-bonuses-work', label: 'How cashback sign-up bonuses work' }
    ],
    outbound: [{ href: 'https://www.joinhoney.com/ref/nwpz6sw', label: 'Join PayPal Honey' }]
  }
]

const CATEGORY_GUIDE_SLUGS: Record<string, string[]> = {
  shopping: [
    'rakuten-vs-topcashback',
    'topcashback-referral-program',
    'paypal-honey-referral-points',
    'how-cashback-signup-bonuses-work',
    'best-cashback-portals-2026'
  ],
  electronics: ['rakuten-vs-topcashback', 'how-cashback-signup-bonuses-work', 'best-cashback-portals-2026'],
  finance: ['chime-referral-requirements', 'how-cashback-signup-bonuses-work']
}

const STORE_GUIDE_SLUGS: Record<string, string[]> = {
  rakuten: ['rakuten-vs-topcashback', 'how-cashback-signup-bonuses-work', 'best-cashback-portals-2026'],
  topcashback: ['topcashback-referral-program', 'rakuten-vs-topcashback', 'how-cashback-signup-bonuses-work'],
  honey: ['paypal-honey-referral-points', 'best-cashback-portals-2026', 'how-cashback-signup-bonuses-work'],
  chime: ['chime-referral-requirements'],
  lyft: ['best-cashback-portals-2026']
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guideList.find((guide) => guide.slug === slug)
}

export function definedGuides(slugs: string[]): Guide[] {
  const out: Guide[] = []
  for (const slug of slugs) {
    const guide = getGuideBySlug(slug)
    if (guide) out.push(guide)
  }
  return out
}

export function guidesForCategory(slug: string): Guide[] {
  return definedGuides(CATEGORY_GUIDE_SLUGS[slug] ?? [])
}

export function guidesForStore(slug: string): Guide[] {
  return definedGuides(STORE_GUIDE_SLUGS[slug] ?? [])
}

export function formatGuideDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export function guideJsonLd(guide: Guide) {
  const pageUrl = absoluteUrl(`/guides/${guide.slug}`)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: absoluteUrl('/guides') },
          { '@type': 'ListItem', position: 3, name: guide.h1, item: pageUrl }
        ]
      },
      {
        '@type': 'Article',
        headline: guide.h1,
        description: guide.description,
        datePublished: guide.publishedAt,
        dateModified: guide.updatedAt,
        url: pageUrl,
        author: { '@type': 'Organization', name: 'BonusBridge' },
        publisher: { '@type': 'Organization', name: 'BonusBridge' },
        mainEntityOfPage: pageUrl
      },
      {
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      }
    ]
  }
}

export function assertGuideCatalog(guides: Guide[]): void {
  const slugs = new Set<string>()
  for (const guide of guides) {
    if (slugs.has(guide.slug)) {
      throw new Error(`Duplicate guide slug: ${guide.slug}`)
    }
    slugs.add(guide.slug)
    if (guide.metaTitle.length > 60) {
      throw new Error(`Title too long: ${guide.slug}`)
    }
    if (guide.description.length < 40 || guide.description.length > 170) {
      throw new Error(`Description length: ${guide.slug}`)
    }
    if (guide.faqs.length < 2) {
      throw new Error(`Need FAQs: ${guide.slug}`)
    }
    if (guide.sections.length < 2) {
      throw new Error(`Need sections: ${guide.slug}`)
    }
    if (guide.table.columns.length < 2) {
      throw new Error(`Need columns: ${guide.slug}`)
    }
    if (guide.table.rows.some((row) => row.length !== guide.table.columns.length)) {
      throw new Error(`Row shape: ${guide.slug}`)
    }
    if (guide.outbound.length < 1) {
      throw new Error(`Need outbound: ${guide.slug}`)
    }
  }
}

assertGuideCatalog(guideList)
