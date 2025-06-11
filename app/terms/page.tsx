import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Terms of Service
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: June 11, 2025
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                By accessing or using Emotional Relief AI, you agree to be bound
                by these Terms of Service. If you do not agree to these terms,
                please do not use our service. We reserve the right to modify
                these terms at any time, and such modifications shall be
                effective immediately upon posting on this website. Your
                continued use of the service will be deemed your acceptance of
                the modified terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Service Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                Emotional Relief AI provides an AI-powered conversational
                service designed to help users process negative emotions. Our
                service is intended for informational and emotional support
                purposes only and is not a substitute for professional medical
                advice, diagnosis, or treatment. The AI responses are generated
                through automated processes and should not be considered as
                professional counseling or therapy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                To access certain features of our service, you may be required
                to create an account. You are responsible for maintaining the
                confidentiality of your account information and for all
                activities that occur under your account. You agree to notify us
                immediately of any unauthorized use of your account. We reserve
                the right to terminate accounts at our discretion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. User Conduct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7 mb-4">
                You agree not to use Emotional Relief AI to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Distribute harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the service or servers</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                All content, features, and functionality of Emotional Relief AI,
                including but not limited to text, graphics, logos, and
                software, are owned by us or our licensors and are protected by
                copyright, trademark, and other intellectual property laws. You
                may not reproduce, distribute, modify, create derivative works
                of, publicly display, or exploit any content from our service
                without our explicit permission.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                To the maximum extent permitted by law, Emotional Relief AI and
                its affiliates shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including without
                limitation, loss of profits, data, or use, arising out of or in
                connection with the use of our service, whether based on
                contract, tort, negligence, strict liability, or otherwise.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                Emotional Relief AI is provided on an &quot;as is&quot; and
                &quot;as available&quot; basis without any warranties of any
                kind, either express or implied. We do not warrant that the
                service will be uninterrupted, timely, secure, or error-free, or
                that the results obtained from the use of the service will be
                accurate or reliable.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                These Terms of Service shall be governed by and construed in
                accordance with the laws of [Jurisdiction], without regard to
                its conflict of law provisions. You agree to submit to the
                personal and exclusive jurisdiction of the courts located within
                [Jurisdiction] for the resolution of any disputes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                If you have any questions about these Terms of Service, please
                contact us at
                <span className="text-primary">
                  {" "}
                  legal@emotionalreliefai.com
                </span>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
