import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          About Emotional Relief AI
        </h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                Helping people process negative emotions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                Emotional Relief AI was created with a simple but powerful
                mission: to provide a safe, judgment-free space where people can
                express and process their negative emotions. We believe that
                acknowledging and working through difficult feelings is an
                essential part of emotional well-being.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>AI-powered emotional support</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7 mb-4">
                Our AI companion is designed to listen and respond to your
                expressions of frustration, stress, anger, or any other negative
                emotions you might be experiencing. Unlike talking to a person,
                our AI offers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Complete privacy - your conversations are confidential</li>
                <li>24/7 availability - get support whenever you need it</li>
                <li>
                  No judgment - express yourself freely without fear of
                  criticism
                </li>
                <li>
                  Thoughtful responses - receive supportive and constructive
                  feedback
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Approach</CardTitle>
              <CardDescription>
                Evidence-based emotional processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                Our approach is grounded in psychological research showing that
                expressing negative emotions in a constructive way can help
                reduce their intensity and impact. The AI is trained to respond
                with empathy, ask helpful questions, and guide users toward
                insights about their emotions without trying to &quot;fix&quot;
                or dismiss their feelings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy & Ethics</CardTitle>
              <CardDescription>Your well-being is our priority</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                We take your privacy seriously. While we store conversations to
                improve our service, all data is anonymized and protected. Our
                AI is designed with ethical guidelines to ensure it provides
                supportive responses and recognizes when a user might need
                professional help beyond what our service can provide.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>We&apos;d love to hear from you</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">
                If you have questions, feedback, or suggestions about Emotional
                Relief AI, please reach out to us at{" "}
                <span className="text-primary">
                  support@emotionalreliefai.com
                </span>
                . We&apos;re constantly working to improve our service and value
                your input.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
