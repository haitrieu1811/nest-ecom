import { Body, Container, Head, Heading, Html, Img, Section, Tailwind, Text } from '@react-email/components'

interface OTPEmailProps {
  code: string
  title: string
  description: string
}

const logo = 'https://nestjs.com/logo-small-gradient.0ed287ce.svg'

export const OTPEmail = ({ code, title, description }: OTPEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white font-plaid">
        <Container className="bg-white border border-solid border-[#eee] rounded shadow-[rgba(20,50,70,.2)] shadow-md mt-5 max-w-[360px] mx-auto my-0 pt-[68px] px-0 pb-[130px]">
          <Img src={logo} width="70" height="70" alt="Logo" className="mx-auto my-0" />
          <Text className="text-[#0a85ea] text-[11px] font-bold h-4 tracking-[0] leading-[16px] mt-4 mb-2 mx-2 uppercase text-center">
            {title}
          </Text>
          <Heading className="text-black font-medium font-[HelveticaNeue-Medium,Helvetica,Arial,sans-serif] text-[20px] leading-[24px] my-0 text-center">
            {description}
          </Heading>
          <Section className="bg-[rgba(0,0,0,.05)] rounded mx-auto font-[HelveticaNeue-Bold] mt-4 mb-3.5 align-middle w-[280px]">
            <Text className="text-black text-[32px] font-bold tracking-[6px] leading-10 py-2 mx-auto my-0 block text-center">
              {code}
            </Text>
          </Section>
          <Text className="text-[#444] text-[15px] leading-[23px] tracking-[0] py-0 px-10 m-0 text-center">
            Nếu bạn không gửi yêu cầu vui lòng bỏ qua email này
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

OTPEmail.PreviewProps = {
  code: '144833',
  title: 'Xác thực email của bạn',
  description: 'Nhập mã bên dưới để hoàn tất đăng ký tài khoản.',
} as OTPEmailProps

export default OTPEmail
