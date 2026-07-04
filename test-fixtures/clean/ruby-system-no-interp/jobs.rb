def run
  # Argument-list form, no string interpolation — no shell. VC094 must NOT fire.
  system("convert", "input.png", "output.png")
end
