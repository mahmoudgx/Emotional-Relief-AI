import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mb-8">
          Last updated: June 11, 2025
        </p>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                At Emotional Relief AI, we take your privacy seriously. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our service. Please read
                this policy carefully. By using our service, you consent to the
                data practices described in this statement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7 mb-4">
                We may collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Personal Information:</strong> When you create an
                  account, we collect your email address, name (if provided),
                  and authentication information.
                </li>
                <li>
                  <strong>Conversation Data:</strong> We store the content of
                  your conversations with our AI to provide and improve our
                  service.
                </li>
                <li>
                  <strong>Usage Information:</strong> We collect information
                  about how you interact with our service, including access
                  times, pages viewed, and the routes by which you access our
                  service.
                </li>
                <li>
                  <strong>Device Information:</strong> We may collect
                  information about the device you use to access our service,
                  including hardware model, operating system, and browser type.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7 mb-4">
                We use the information we collect for various purposes,
                including to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide, maintain, and improve our service</li>
                <li>Process and complete transactions</li>
                <li>
                  Send you technical notices, updates, and support messages
                </li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Develop new products and services</li>
                <li>
                  Monitor and analyze trends, usage, and activities in
                  connection with our service
                </li>
                <li>
                  Detect, investigate, and prevent fraudulent transactions and
                  other illegal activities
                </li>
                <li>
                  Personalize your experience by providing content tailored to
                  your interests
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Data Storage and Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                We implement appropriate technical and organizational measures
                to protect the security of your personal information. However,
                please be aware that no method of transmission over the Internet
                or method of electronic storage is 100% secure. While we strive
                to use commercially acceptable means to protect your personal
                information, we cannot guarantee its absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                We will retain your personal information only for as long as is
                necessary for the purposes set out in this Privacy Policy. We
                will retain and use your information to the extent necessary to
                comply with our legal obligations, resolve disputes, and enforce
                our policies. If you wish to request that we delete your data,
                please contact us at the email address provided below.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Sharing Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7 mb-4">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>With Service Providers:</strong> We may share your
                  information with third-party vendors, service providers, and
                  other third parties who perform services on our behalf.
                </li>
                <li>
                  <strong>Business Transfers:</strong> If we are involved in a
                  merger, acquisition, or sale of all or a portion of our
                  assets, your information may be transferred as part of that
                  transaction.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your
                  information where required to do so by law or in response to
                  valid requests by public authorities.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share your
                  information with your consent or as otherwise disclosed at the
                  time of data collection or sharing.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7 mb-4">
                Depending on your location, you may have certain rights
                regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  The right to access the personal information we have about you
                </li>
                <li>
                  The right to request that we correct or update your personal
                  information
                </li>
                <li>
                  The right to request that we delete your personal information
                </li>
                <li>
                  The right to object to the processing of your personal
                  information
                </li>
                <li>
                  The right to request that we restrict our processing of your
                  personal information
                </li>
                <li>The right to data portability</li>
              </ul>
              <p className="text-muted-foreground leading-7 mt-4">
                To exercise these rights, please contact us using the
                information provided below.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Children&apos;s Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                Our service is not intended for use by children under the age of
                13. We do not knowingly collect personal information from
                children under 13. If you are a parent or guardian and you are
                aware that your child has provided us with personal information,
                please contact us so that we can take necessary actions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;Last updated&quot; date. You
                are advised to review this Privacy Policy periodically for any
                changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                If you have any questions about this Privacy Policy, please
                contact us at
                <span className="text-primary">
                  {" "}
                  privacy@emotionalreliefai.com
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
