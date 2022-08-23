#include "lib/catch.hpp"

TEST_CASE("Verify Illinify GIF", "[points=30]") {
  REQUIRE( system("make") == 0 );
  REQUIRE( system("./main tests/tay-small.gif") == 0 );
  REQUIRE( system("diff tests/tay-small-illinify.gif tests/tay-small-illinify-expected.gif") == 0 );
}
