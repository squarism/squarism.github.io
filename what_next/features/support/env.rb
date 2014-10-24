# let's make cucumber talk minitest

require 'minitest/unit'

World do
  extend MiniTest::Assertions
end

