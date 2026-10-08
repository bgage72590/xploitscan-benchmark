# RS256 key for signing API session tokens. Generated on boot when the
# environment does not provide one, so local and preview deploys just work.
JWT_PRIVATE_KEY =
  if ENV["JWT_PRIVATE_KEY"].present?
    OpenSSL::PKey::RSA.new(ENV["JWT_PRIVATE_KEY"])
  else
    OpenSSL::PKey::RSA.new(2048)
  end

JWT_PUBLIC_KEY = JWT_PRIVATE_KEY.public_key
