# Select version of g++
ifneq (, $(shell which g++-9))
CXX = g++-9
else
ifneq (, $(shell which g++-11))
CXX = g++-11
else
ifneq (, $(shell which g++))
CXX = g++
else
$(error No g++ compiler found.)
endif
endif
endif


CXX += -g $(CS340)
CFLAGS = -W -Wall -Wno-pointer-sign
CFLAGS_CATCH = -fpermissive -w
CC = ${CXX} -x c ${CFLAGS}

all: main


# .o rules:
main.o: main.c
	$(CC) $(CFLAGS) $^ -c -o $@

gif.o: gif.c
	$(CC) $(CFLAGS) $^ -c -o $@


# exe rules:
main: main.o gif.o
	${CXX} $^ -o $@


# test rules:
test: tests/test.o tests/test-all.o
	$(CXX) $(CFLAGS_CATCH) $^ -o $@

tests/test.o: tests/test.cpp
	$(CXX) $(CFLAGS_CATCH) $^ -c -o $@

tests/test-all.o: tests/test-all.cpp
	$(CXX) $(CFLAGS_CATCH) $^ -c -o $@


clean:
	rm -f main test *.o tests/*.o tests/tay-small-illinify.gif