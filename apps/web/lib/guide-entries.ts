/**
 * Dated guide records. Dollar figures are copied from the provider pages
 * named in each section, with the date those pages were read.
 */
import type { Guide } from '@/lib/guides'
import { FTC_AFFILIATE_DISCLOSURE } from '@/lib/site-disclaimers'

const CHECKED = '2026-11-13T18:00:00.000Z'
const TCB_PUBLISHED = '2026-11-09T18:00:00.000Z'

export const rakutenReferralBonusGuide: Guide = {
  slug: 'rakuten-referral-bonus-how-it-works',
  metaTitle: 'Rakuten Referral Bonus: How It Works | BonusBridge',
  h1: 'Rakuten referral bonus: how it works',
  description:
    'How the current Rakuten $50 referral bonus works in the US: the $50 qualifying spend within 90 days, Amazon exclusions, offer dates, and payout timing.',
  publishedAt: CHECKED,
  updatedAt: CHECKED,
  sections: [
    {
      id: 'current-offer',
      heading: 'What the current $50 offer says',
      paragraphs: [
        'This page explains the US Rakuten Refer-A-Friend program in plain language. Dollar amounts and dates below come from Rakuten’s official Referral Site and Program Terms, checked Nov 13, 2026. Rakuten can change or cancel an offer at any time, so confirm the live wording before you rely on a number.',
        'Rakuten’s standing Program Terms do not lock in a fixed dollar amount. They send you to the Referral Site for the Referral Bonus Terms, which may change from time to time.',
        'On Nov 13, 2026, that official Referral Site advertised a $50 Referral Bonus. The legal footnote on the same page says you qualify for a $50 Referral Bonus when a person you refer signs up as a new member using your referral link (or another method Rakuten supplies) during the Offer Period, and makes Qualifying Purchase(s) totaling at least $50 within 90 days of signing up.',
        'The Offer Period on that page is 12:00 AM PT October 1, 2026 to 11:59 PM PT December 31, 2026. The same footnote says the offer may be modified or cancelled anytime, and that you may qualify for a Referral Bonus more than one time. The page also uses the marketing line "Bonuses are unlimited, so keep on referring."',
        'For this specific $50 offer, the footnote requires you and your referee to reside and be located in the 50 United States or District of Columbia. That is narrower than the standing Program Terms, which still describe the overall program as open to members in the 50 United States, District of Columbia, or Canada. Do not assume a Canada-based signup qualifies for this $50 promotion.',
        'The Referral Bonus is added to your next Cash Back payment, and only if the referee is a Qualified Referral under the Program Terms.'
      ],
      bullets: [
        'Referrer bonus on the Referral Site that day: $50.',
        'Qualifying spend: at least $50 within 90 days of signup.',
        'Offer Period: October 1, 2026 through December 31, 2026 (Pacific Time).',
        'This $50 offer is limited to the 50 United States or District of Columbia.'
      ],
      links: [
        { href: 'https://www.rakuten.com/referral/default.do', label: 'Rakuten Referral Site' },
        { href: 'https://www.rakuten.com/help/article/referral-program-terms', label: 'Rakuten Referral Program Terms' }
      ]
    },
    {
      id: 'new-member',
      heading: 'Does the new member also get $50?',
      paragraphs: [
        'The standing Program Terms say a referee may qualify for a Referral Sign Up Bonus, that those terms also live on the Referral Site and may change, and that there is one Referral Sign Up Bonus per eligible new member.',
        'The official Referral Site, checked Nov 13, 2026, markets the current promotion as "Give and get unlimited $50 bonuses." The same page’s social description tells a new member, "you’ll get $50 after you spend $50." The legal footnote on that page spells out the referrer’s $50 Referral Bonus and the $50 qualifying spend. It does not, in that footnote, separately define a $50 Sign Up Bonus for the new member.',
        'Treat the new-member amount as whatever the official Referral Site or signup flow shows on the day the friend joins. The official FAQ says bonus amounts can change, and the person who was referred will get the bonus that was available on the day of sign up.'
      ],
      bullets: [
        'Referrer: $50 Referral Bonus when the footnote rules are met.',
        'New member: marketed as $50 on the Referral Site. Confirm the live Sign Up Bonus on the day of signup.',
        'One Referral Sign Up Bonus per eligible new member, under the standing terms.'
      ],
      links: [
        { href: 'https://www.rakuten.com/help/article/referral-program-terms', label: 'Referral Program Terms, section 3.2' },
        {
          href: 'https://www.rakuten.com/help/article/refer-a-friend-program-faq-360002117087',
          label: 'Refer-A-Friend Program FAQ'
        }
      ]
    },
    {
      id: 'qualified',
      heading: 'What makes a referral qualified',
      paragraphs: [
        'Under the Program Terms, a Qualified Referral is a referee who is a natural person (not a business, legal entity, or pet) residing in and located in the 50 United States, District of Columbia, or Canada. The current $50 offer footnote tightens this to the 50 United States or District of Columbia.',
        'The referee must be a new member on rakuten.com, sign up using the referrer’s custom referral link or another method Rakuten supplies that allows proper tracking, and make purchase(s) that earn Cash Back through rakuten.com, the Rakuten App, or the Rakuten browser extension within 90 days of signup, according to the applicable bonus terms.',
        'The referee must consent to and comply with Rakuten’s Terms and Conditions and Privacy Policy, and must be the person who pays for the Qualifying Purchase. Purchases made on Amazon.com are not Qualifying Purchases, except purchases on music.amazon.com.',
        'The current offer footnote also says a referee is not a Qualified Referral if they cancel, return, or exchange the Qualifying Purchase, if the purchase has not earned Cash Back, or if the purchase is found to be fraudulent, abusive, unethical, suspicious, or otherwise inconsistent with the Program Terms. Self-referral, making purchases on behalf of someone else, or using a Rakuten account that is not yours, are not allowed.'
      ],
      bullets: [
        'New member, tracked signup, and Cash Back purchases within 90 days.',
        'Amazon.com does not count, except music.amazon.com.',
        'Returns, cancellations, exchanges, and unpaid Cash Back remove qualification.',
        'Self-referral is not allowed.'
      ],
      links: [
        { href: 'https://www.rakuten.com/help/article/referral-program-terms', label: 'Referral Program Terms, sections 2 and 7' },
        { href: 'https://www.rakuten.com/referral/default.do', label: 'Offer footnote on the Referral Site' }
      ]
    },
    {
      id: 'timing',
      heading: 'When the bonus is confirmed and paid',
      paragraphs: [
        'Two official pages describe timing, and they are not identical, so both are quoted here. The Referral Site FAQ says you will generally receive your referral bonus within 60 days of your referral’s qualifying purchase. The same page defines pending as a friend who has joined but may not have a verified qualifying purchase yet, and confirmed as a friend who has joined, made a qualifying purchase, and had the details confirmed.',
        'Rakuten’s official payment help, updated October 30, 2026, says referral bonuses will be confirmed once your friend makes a qualifying purchase and their Cash Back is confirmed. Online and in-store Cash Back typically takes 3 to 14 weeks to be confirmed, in case of returns, exchanges, exclusions, or other order changes. Dining Cash Back is confirmed within 3 to 5 days after you dine. Travel Cash Back is typically confirmed within 45 to 120 days after you complete the booking.',
        'Bonuses depend on a qualifying order and are confirmed at the same time as the related Cash Back. Confirmed Cash Back, bonuses, and other rewards are paid by the method you selected every three months, on or by February 15, May 15, August 15, and November 15. You need $5 or more in confirmed Cash Back to get paid. A confirmed balance under $5 carries over to the next payment date.',
        'Payment methods listed on that page are PayPal, Bilt Points, Samsung Cash, or check. Eligible American Express Card Members can choose Membership Rewards points instead of Cash Back. You can also redeem a confirmed balance of at least $5 for a gift card, subject to certain limits, and Rakuten says that can arrive within minutes.',
        'Because the referral bonus waits for the friend’s Cash Back to be confirmed, a purchase that is still pending does not yet lock in the bonus. Returns and cancelled orders can remove it.'
      ],
      bullets: [
        'Referral Site: generally within 60 days of the qualifying purchase.',
        'Payment help: confirmation waits for the friend’s Cash Back (often 3 to 14 weeks online or in store).',
        'Payout minimum: $5 confirmed Cash Back, on the quarterly payment date, or a gift card of at least $5 confirmed.',
        'A pending purchase does not lock the bonus.'
      ],
      links: [
        { href: 'https://www.rakuten.com/referral/default.do', label: 'Referral Site FAQ' },
        { href: 'https://www.rakuten.com/help/article/when-will-i-get-paid', label: 'When Will I Get Paid?' }
      ]
    },
    {
      id: 'sharing',
      heading: 'Where you may share a Rakuten link',
      paragraphs: [
        'Rakuten allows you to post your referral link on a page you own and control. A BonusBridge page that we operate qualifies as that kind of page. The Program Terms do not allow posting the link on a page you do not own or control, including merchant, Facebook, or forum pages.',
        'The same restrictions also prohibit self-referral, fake accounts or sites, bulk email or other spam to strangers, bidding on keywords containing "Ebates" or "Rakuten" (including common misspellings), putting Rakuten trademarks in ad text, extensions, or banner ads, and paid advertising that sends traffic directly to your referral link.',
        'If you want a broader commercial arrangement, Rakuten’s Program Terms point interested people to a Sponsored Influencer application. That is separate from the member Refer-A-Friend link on this site.'
      ],
      bullets: [
        'Allowed on pages you own and control.',
        'Not allowed on pages you do not own, including Facebook or forum pages.',
        'Paid ads must not send traffic directly to the referral link.',
        'The link on BonusBridge is on a site we operate.'
      ],
      links: [
        { href: 'https://www.rakuten.com/help/article/referral-program-terms', label: 'Referral Program Terms, sections 5 and 7' },
        { href: '/stores/rakuten', label: 'Rakuten store page' }
      ]
    }
  ],
  table: {
    caption: 'Rakuten referral rules at a glance',
    columns: ['Topic', 'What official pages said on Nov 13, 2026'],
    rows: [
      ['Current referrer bonus', '$50 Referral Bonus during the Offer Period, if the rules below are met'],
      ['Offer Period', '12:00 AM PT October 1, 2026 to 11:59 PM PT December 31, 2026'],
      ['Qualifying spend', 'Qualifying Purchase(s) totaling at least $50 within 90 days of signup'],
      ['New-member bonus', 'Marketed as $50 on the Referral Site; confirm the live Sign Up Bonus on the day of signup'],
      ['Who can use this $50 offer', 'Referrer and referee must reside and be located in the 50 United States or District of Columbia'],
      ['Amazon.com', 'Not a Qualifying Purchase, except music.amazon.com'],
      [
        'Bonus timing',
        'Generally within 60 days of the qualifying purchase; confirmation waits for the friend’s Cash Back to confirm (typically 3 to 14 weeks for online and in-store)'
      ],
      [
        'Payout',
        'Added to the next Cash Back payment. $5 confirmed minimum. Quarterly payment dates, or a gift card of at least $5 confirmed'
      ],
      [
        'Sharing',
        'Allowed on pages you own and control. Not allowed on pages you do not own, including Facebook or forum pages, and not in paid ads to the referral link'
      ]
    ]
  },
  faqs: [
    {
      question: 'Is the Rakuten referral bonus always $50?',
      answer:
        'No. The Program Terms say Referral Bonus Terms live on the Referral Site and may change from time to time. The $50 figure, the $50 qualifying spend, and the October 1 to December 31, 2026 Offer Period were on the official Referral Site on Nov 13, 2026. Confirm that page before you treat $50 as still current.'
    },
    {
      question: 'Do Amazon.com purchases count toward the referral bonus?',
      answer:
        'No, with one official exception. The Program Terms say purchases on Amazon.com are not Qualifying Purchases, other than purchases on music.amazon.com.'
    },
    {
      question: 'How long does the new member have to qualify?',
      answer:
        'The Program Terms and the current offer footnote both use a 90-day window from signup. For the current $50 offer, Qualifying Purchase(s) must total at least $50 in that window, earn Cash Back, and not be cancelled, returned, or exchanged.'
    },
    {
      question: 'When does the referrer actually receive the $50?',
      answer:
        'The Referral Site says you will generally receive the referral bonus within 60 days of the qualifying purchase. Official payment help says the bonus is confirmed only after the friend’s qualifying purchase and their Cash Back are confirmed, and that online and in-store Cash Back typically takes 3 to 14 weeks to confirm. The bonus is then added to your next Cash Back payment. You need $5 or more in confirmed Cash Back to be paid on a quarterly payment date, unless you redeem an eligible confirmed balance for a gift card.'
    },
    {
      question: 'Can I post my Rakuten referral link in a Facebook group or on a forum?',
      answer:
        'No. The Program Terms prohibit posting your referral link on any page that is not owned and controlled by you, including merchant, Facebook, or forum pages. They also prohibit paid ads that send traffic directly to the referral link. The link on BonusBridge is on a site we operate.'
    },
    {
      question: 'How does BonusBridge get paid?',
      answer: FTC_AFFILIATE_DISCLOSURE
    }
  ],
  related: [
    { href: '/stores/rakuten', label: 'Rakuten on BonusBridge' },
    { href: '/guides/rakuten-vs-topcashback', label: 'Rakuten vs TopCashback' },
    { href: '/guides/how-cashback-signup-bonuses-work', label: 'How cashback sign-up bonuses work' },
    { href: '/guides/best-cashback-portals-2026', label: 'Best cashback portals in the US for 2026' },
    { href: '/categories/shopping', label: 'Shopping category' },
    { href: '/disclosures', label: 'Disclosures' }
  ],
  outbound: [{ href: 'https://www.rakuten.com/r/MVADIM7', label: 'Join Rakuten' }]
}

export const topcashbackReferralGuide: Guide = {
  slug: 'topcashback-referral-program',
  metaTitle: 'TopCashback Referral Program Explained | BonusBridge',
  h1: 'TopCashback referral program: who gets the $10',
  description:
    'TopCashback’s $10 referral bonus: the new member needs $10 eligible available Cash Back within 365 days, plus verification and exclusions.',
  publishedAt: TCB_PUBLISHED,
  updatedAt: CHECKED,
  sections: [
    {
      id: 'who-gets-what',
      heading: 'Who gets the $10, and who does not',
      paragraphs: [
        'TopCashback’s referral terms allow a link on a site you own if that site has a cookie consent mechanism, a Cookie Policy, and a Privacy Policy, and if commercial promoters follow FTC rules. BonusBridge publishes those notices on our Cookie Notice, Privacy Policy, and Disclosures pages.',
        'The current promotion on TopCashback’s official referral terms, last updated 08/15/2026 and checked Nov 13, 2026, pays the referrer $10 Cash Back for each qualifying referral. The $10 is not a signup gift to the new member.',
        'The same terms do not state a fixed referral bonus for the person who joins. Any welcome offer the new member sees is whatever TopCashback is advertising at signup, and it is subject to change. The terms also say the bonus the referrer receives is the amount advertised on the site at the time the friend signed up through the link. That amount can differ from what was shown when the link was sent, or when the bonus was later credited.',
        'The official Refer a Friend page uses the headline "Refer a friend & earn $10" and the steps "They sign up and earn at least $10 Cash Back" and "You get a bonus." The legal terms are more precise than that marketing copy: the $10 the new member must earn has to be eligible, available Cash Back from qualifying retailers.'
      ],
      bullets: [
        'Referrer: $10 Cash Back per qualifying referral under the current promotion.',
        'New member: no fixed amount in the referral terms.',
        'The referrer amount is the one advertised when the friend signs up, and it can change.'
      ],
      links: [
        { href: 'https://www.topcashback.com/referrals/terms/', label: 'Refer a Friend Terms' },
        { href: 'https://www.topcashback.com/refer-a-friend/', label: 'Refer a Friend page' },
        { href: '/cookies', label: 'Cookie Notice' },
        { href: '/privacy-policy', label: 'Privacy Policy' },
        { href: '/disclosures', label: 'Disclosures' }
      ]
    },
    {
      id: 'qualifying',
      heading: 'The requirements, step by step',
      paragraphs: [
        'You receive a referral bonus only if your friend clicks your unique Refer a Friend link and signs up through that link, verifies the TopCashback account, and meets the Cash Back requirement in the current promotion: a minimum of $10 in eligible Cash Back from qualifying retailers within 365 days of joining.',
        'That Cash Back has to become available. The terms say that once the new member has $10 available Cash Back, the referrer will receive the applicable referral bonus, and that the referral bonus will become payable when the referred friend’s Cash Back is available.',
        'The official Refer a Friend page says the same thing in shorter form: once the person you referred has earned the required Cash Back amount and it has become payable, your bonus will be available to cash out.',
        'Pending, in-progress, or excluded Cash Back does not meet the $10 available threshold. An unverified account cannot qualify. Signing up later through the homepage, without the unique link, does not meet the click-and-join rule. The program is open to TopCashback USA members in good standing. Self-referral is not allowed. Referral bonuses are paid only for genuine signups, and they are not paid if the new account has been terminated.'
      ],
      bullets: [
        'Unique link, then signup through that link.',
        'Account verification.',
        'At least $10 in eligible Cash Back from qualifying retailers within 365 days.',
        'That Cash Back must be available, not merely pending.'
      ],
      links: [
        { href: 'https://www.topcashback.com/referrals/terms/', label: 'Refer a Friend Terms, current promotion' },
        { href: '/guides/how-cashback-signup-bonuses-work', label: 'Pending versus payable Cash Back' }
      ]
    },
    {
      id: 'exclusions',
      heading: 'What does not count toward the $10',
      paragraphs: [
        'This is the part that most often causes a missed bonus. TopCashback’s terms exclude Cash Back awarded as goodwill payments, incentives, or contest winnings, additional sign-up bonuses, bonus promotions, new member deals, and Cash Back from retailers on the excluded list in section 8, using the list that was in force when the new member signed up.',
        'Section 8 is a long official list. On Nov 13, 2026 it included many Freebie and Reward offers, plus named retailers and categories such as Booking.com, IHG Hotels & Resorts, Skyscanner, ALL Accor, several VPN services, iStock, McAfee, Crutchfield, and "TopCashback - Sign-Up Bonus." The list can change. Use the live terms, not a copied list from this page, as the source of truth.',
        'The terms also say you must not promote your referral link alongside any other new member incentives unless the promotion’s terms expressly allow it. If more than one promotion is earned for the same signup, a bonus or incentive may be removed.'
      ],
      bullets: [
        'Goodwill, incentives, contest winnings, extra signup bonuses, bonus promotions, and new member deals do not count.',
        'Retailers on the section 8 list do not count.',
        'Do not stack the referral link with another new-member incentive unless that promotion allows it.'
      ],
      links: [{ href: 'https://www.topcashback.com/referrals/terms/', label: 'Refer a Friend Terms, sections 4 and 8' }]
    },
    {
      id: 'payout',
      heading: 'When the referrer can cash out',
      paragraphs: [
        'The referral bonus becomes payable when the new member’s qualifying Cash Back is available, not when a purchase is first tracked.',
        'TopCashback’s official help, checked Nov 13, 2026, says Cash Back is In Progress after a tracked purchase, is approved after the retailer reviews the transaction, and becomes Available only after the retailer has received an invoice from the affiliate network. Each retailer has a different time period. The Earnings page shows an estimate, and that estimate is not a guarantee. For a vacation purchase, you must complete the stay before Cash Back can move to Available. Once Cash Back is Available, you can withdraw it at any time.',
        'Official help and site terms list these payout methods: bank transfer (ACH is only available to US bank account holders), Venmo, PayPal, and gift cards or e-gift cards. The receive-Cash-Back help page names Amazon, Starbucks, Target, and Sephora as examples of gift card options.',
        'Those help pages do not state a minimum cash-out amount. This page does not invent one. The $10 figure in the referral terms is the new member’s eligible available Cash Back threshold for the referrer’s bonus, not a documented withdrawal minimum.'
      ],
      bullets: [
        'Payable when the friend’s qualifying Cash Back is available.',
        'Payout methods listed in help: bank (ACH for US bank accounts), Venmo, PayPal, or gift cards.',
        'No withdrawal minimum is stated on those help pages.',
        'Vacation Cash Back waits until the stay is completed.'
      ],
      links: [
        { href: 'https://www.topcashback.com/help/cash-back-statuses/', label: 'When will I get my Cash Back?' },
        { href: 'https://www.topcashback.com/help/receive-cash-back/', label: 'How do I receive my Cash Back?' },
        { href: 'https://www.topcashback.com/terms/', label: 'TopCashback Terms and Conditions' }
      ]
    },
    {
      id: 'commercial-cap',
      heading: 'A $5 cap that applies to comparison websites',
      paragraphs: [
        'The Refer a Friend terms describe a $10 referrer bonus for the current promotion. TopCashback’s general site terms add a separate rule for commercial promotion.',
        'Those general terms say that referral bonuses earned through commercial means, including comparison websites, will earn no more than $5 per referral subject to minimum thresholds, unless express written consent is given and signed by TopCashback. They also tell you to read the Referral Terms before sending invites.',
        'BonusBridge is a comparison website. Until an official affiliate agreement or other written consent is in place, we do not promise that a signup through this site will pay the site operator $10 rather than the commercial cap. A typical member who refers family and friends under the Refer a Friend terms is still described, in the current promotion, as eligible for $10 after the new member qualifies.',
        'If you promote TopCashback to a wider audience, the referral terms also tell content creators to consider TopCashback’s separate affiliate program. Paid search and other paid ads that use the referral link are not allowed without TopCashback’s prior permission.'
      ],
      bullets: [
        'Current friend-to-friend promotion: $10 after the new member qualifies.',
        'Comparison websites: general terms cap the bonus at $5 per referral unless TopCashback signs a written consent.',
        'Paid ads to the referral link need TopCashback’s prior permission.'
      ],
      links: [
        { href: 'https://www.topcashback.com/terms/', label: 'TopCashback Terms and Conditions' },
        { href: 'https://www.topcashback.com/referrals/terms/', label: 'Refer a Friend Terms, sections 6 and 7' },
        { href: 'https://www.topcashback.com/dyn/affiliate-program/', label: 'TopCashback affiliate program' }
      ]
    }
  ],
  table: {
    caption: 'TopCashback referral requirements at a glance',
    columns: ['Item', 'What official terms and help said on Nov 13, 2026'],
    rows: [
      ['Referrer reward (current promotion)', '$10 Cash Back per qualifying referral'],
      ['New member reward', 'Not a fixed amount in the referral terms'],
      ['Threshold', '$10 of eligible, available Cash Back from qualifying retailers'],
      ['Window', '365 days from the day the new member joins'],
      ['Required steps', 'Unique link, signup through that link, account verification, then the $10 available threshold'],
      [
        'Does not count',
        'Excluded retailers, goodwill, incentives, contest winnings, extra signup bonuses, bonus promotions, and new member deals'
      ],
      ['When the $10 is payable', 'When the new member’s qualifying Cash Back is available'],
      ['Member payout methods', 'Bank (ACH for US bank accounts), Venmo, PayPal, or gift cards, once Cash Back is Available'],
      ['Comparison websites', 'General site terms cap commercial referral bonuses at $5 per referral unless TopCashback gives signed written consent'],
      ['Can it change?', 'Yes. Amount and qualifying period are subject to change']
    ]
  },
  faqs: [
    {
      question: 'Do I get $10 for joining TopCashback through a referral link?',
      answer:
        'The current referral terms pay the $10 to the member who shared the link, after you qualify. They do not state a fixed $10 (or any other fixed amount) for the new member. Check TopCashback’s signup page for any welcome offer running on the day you join. Welcome Cash Back, bonus promotions, and new member deals do not count toward the referrer’s $10 threshold.'
    },
    {
      question: 'How long do I have to reach $10 in Cash Back?',
      answer:
        '365 days from the day you join, and only eligible Cash Back from qualifying retailers counts. It also has to become available, not merely in progress.'
    },
    {
      question: 'Does bonus Cash Back or a freebie offer count toward the $10?',
      answer:
        'No. The terms exclude goodwill, incentives, contest winnings, additional signup bonuses, bonus promotions, new member deals, and Cash Back from retailers on the excluded list in section 8.'
    },
    {
      question: 'When does the referrer actually receive the bonus?',
      answer:
        'After the new member has $10 available eligible Cash Back. Official help says Cash Back becomes Available only after retailer approval and after the retailer has received an invoice from the affiliate network. Timing varies by retailer. Vacation Cash Back waits until the stay is completed. Once the referral bonus is payable, it can be cashed out with other Available Cash Back.'
    },
    {
      question: 'Why do some pages mention $5 instead of $10?',
      answer:
        'The current Refer a Friend promotion states a $10 referrer bonus. TopCashback’s general site terms separately cap referral bonuses earned through commercial means, including comparison websites, at $5 per referral unless TopCashback has given signed written consent. That cap is about commercial promotion, not the ordinary friend-to-friend promotion described in the referral terms.'
    },
    {
      question: 'How does BonusBridge get paid?',
      answer: FTC_AFFILIATE_DISCLOSURE
    }
  ],
  related: [
    { href: '/stores/topcashback', label: 'TopCashback on BonusBridge' },
    { href: '/guides/rakuten-vs-topcashback', label: 'Rakuten vs TopCashback' },
    { href: '/guides/how-cashback-signup-bonuses-work', label: 'How cashback sign-up bonuses work' },
    { href: '/guides/best-cashback-portals-2026', label: 'Best cashback portals in the US for 2026' },
    { href: '/categories/shopping', label: 'Shopping category' },
    { href: '/disclosures', label: 'Disclosures' }
  ],
  outbound: [{ href: 'https://www.topcashback.com/ref/member344836925437', label: 'Join TopCashback' }]
}
