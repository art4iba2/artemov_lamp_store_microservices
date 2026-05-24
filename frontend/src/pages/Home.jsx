import { Link } from "react-router-dom";

function Home() {
  return (
    <section>
      <div className="hero">
        <h1>Интернет-магазин ламп</h1>
        <p>
          Светодиодные, энергосберегающие и декоративные лампы от магазина при заводе.
        </p>
      </div>

      <section className="home-promotions">
        <h2>Акции и распродажи</h2>
        <p className="section-description">
          Перед переходом в каталог ознакомьтесь с актуальными предложениями магазина.
        </p>

        <div className="promo-list">
          <div className="promo-card">
            <h3>Скидка 10% на LED-лампы</h3>
            <p>
              Акция действует на популярные модели светодиодных ламп для дома и офиса.
            </p>
          </div>

          <div className="promo-card">
            <h3>Распродажа складских остатков</h3>
            <p>
              Специальные цены на отдельные модели до окончания товаров на складе.
            </p>
          </div>

          <div className="promo-card">
            <h3>Выгодная покупка комплектом</h3>
            <p>
              При покупке нескольких ламп одной серии можно получить дополнительную скидку.
            </p>
          </div>
        </div>

        <Link to="/catalog" className="button catalog-button">
          Перейти в каталог
        </Link>
      </section>
    </section>
  );
}

export default Home;