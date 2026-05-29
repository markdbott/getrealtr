export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, brokerage, message } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'GetRealtr <hello@getrealtr.com>',
        to: 'mark@fortell.ai',
        reply_to: email,
        subject: `Demo Request — ${firstName} ${lastName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #0B1B2B;">
            <h2 style="font-size: 22px; margin-bottom: 24px;">New Demo Request</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #6E7989; width: 140px; font-size: 14px;">Name</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #6E7989; font-size: 14px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;"><a href="mailto:${email}" style="color: #0B1B2B;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #6E7989; font-size: 14px;">Brokerage</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px;">${brokerage || '—'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6E7989; font-size: 14px; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; font-size: 14px;">${message || '—'}</td>
              </tr>
            </table>
            <p style="margin-top: 32px; font-size: 12px; color: #98A2B0;">Sent from getrealtr.com</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      throw new Error('Resend API error');
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
