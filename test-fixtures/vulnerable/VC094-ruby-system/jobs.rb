def run(params)
  name = params[:name]
  # Ruby command injection: interpolated user input into system() (VC094).
  system("convert #{name}.png out.png")
end
